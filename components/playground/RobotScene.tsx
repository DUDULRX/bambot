"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import URDFLoader, { URDFRobot, URDFJoint } from "urdf-loader";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { GroundPlane } from "@/components/playground/GroundPlane";
import { JointState,JointDetails } from "@/hooks/updateRobotFeedback";

type RobotSceneProps = {
  robotName: string;
  urdfUrl: string;
  orbitTarget?: [number, number, number];
  robotConfigMap: { [key: string]: any };
  setJointDetails: (details: JointDetails[]) => void;
  jointStates: JointState[];
};

export function RobotScene({
  robotName,
  urdfUrl,
  orbitTarget,
  robotConfigMap,
  setJointDetails,
  jointStates,
}: RobotSceneProps) {
  const { scene } = useThree();
  const robotRef = useRef<URDFRobot | null>(null);

  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new URDFLoader(manager);

    loader.load(
      urdfUrl,
      (robot) => {
        robotRef.current = robot;

        const details: JointDetails[] = robot.joints
          ? Object.values(robot.joints)
              .filter(
                (
                  joint
                ): joint is URDFJoint & { 
                  jointType: "revolute"; 
                } =>
                  joint.jointType === "revolute" && !("mimicJoint" in joint && joint.mimicJoint)
              )
              .map((joint) => ({
                name: joint.name,
                servoId: robotConfigMap[robotName].jointNameIdMap[joint.name],
                limit: {
                  lower:
                    joint.limit.lower === undefined
                      ? undefined
                      : Number(joint.limit.lower),
                  upper:
                    joint.limit.upper === undefined
                      ? undefined
                      : Number(joint.limit.upper),
                },
                jointType: joint.jointType,
              }))
          : [];
        setJointDetails(details);

        robot.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / -2);
        robot.traverse((c) => (c.castShadow = true));
        robot.updateMatrixWorld(true);
        const scale = 15;
        robot.scale.set(scale, scale, scale);
        scene.add(robot);
      },
      undefined,
      (error) => console.error("Error loading URDF:", error)
    );
  }, [robotName, urdfUrl, setJointDetails]);

      useFrame(() => {
      const robot = robotRef.current;
      if (!robot?.joints) return;

      jointStates.forEach((state) => {
        if (typeof state.realRadians !== "number") return;

        const joint = robot.joints[state.name];
        if (!joint) return;

        if ("mimicJoint" in joint && joint.mimicJoint) return;

        robot.setJointValue(state.name, state.realRadians);
      });

      robot.updateMatrixWorld(true);
    });

  return (
    <>
      <OrbitControls target={orbitTarget || [0, 0.1, 0.1]} />
      <GroundPlane />
      <directionalLight
        castShadow
        intensity={1}
        position={[2, 20, 5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        intensity={1}
        position={[-2, 20, -5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight intensity={0.4} />
    </>
  );
}
