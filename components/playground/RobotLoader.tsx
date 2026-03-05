"use client";

import { useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Html, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import {
  getPanelStateFromLocalStorage,
  setPanelStateToLocalStorage,
} from "@/lib/panelSettings";

import { robotConfigMap } from "@/config/robotConfig";

import { TooltipProvider } from "@/components/ui/tooltip";
import { RobotScene } from "@/components/playground/RobotScene";
import FeedbackButton from "@/components/playground/FeedbackButtons/FeedbackButton";
import { FeedbackPanel } from "@/components/playground/FeedbackPanels/FeedbackPanel";

import { 
  JointDetails,
  CoordinateDetails,
  updateRobotFeedback 
} from "@/hooks/updateRobotFeedback";

type RobotLoaderProps = {
  robotName: string;
};

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center className="text-4xl text-white">
      {progress} % loaded
    </Html>
  );
}

export default function RobotLoader({ robotName }: RobotLoaderProps) {
  const [jointDetails, setJointDetails] = useState<JointDetails[]>([]);
  const [coordinateDetails, setCoordinateDetails] = useState<CoordinateDetails[]>([]);  

  const [showFeedbackPanel, setShowFeedbackPanel] = useState(() => {
    const stored = getPanelStateFromLocalStorage("feedback", robotName);
    const defaultValue =
      typeof window !== "undefined" ? window.innerWidth >= 900 : true;
    return stored !== null ? stored : defaultValue;
  });

  const config = robotConfigMap[robotName];
  if (!config) {
    throw new Error(`Robot configuration for "${robotName}" not found.`);
  }

  const {
    urdfUrl,
    orbitTarget,
    camera,
    coordinateNameIdMap,
  } = config; 

  const {
    jointStates,
    coordinateStates,
    setJointDetails: updateJointDetails,
    setCoordinateDetails: updateCoordinateDetails,
    updateJointRadians,
    updateCoordinates,
  } = updateRobotFeedback(jointDetails,coordinateDetails);

  const toggleFeedbackPanel = () => {
    setShowFeedbackPanel((prev) => {
      const newState = !prev;
      setPanelStateToLocalStorage("feedback", newState, robotName);
      return newState;
    });
  };

  const hideFeedbackPanel = () => {
    setShowFeedbackPanel(false);
    setPanelStateToLocalStorage("feedback", false, robotName);
  };

  useEffect(() => {
    const map = coordinateNameIdMap ?? {};

    const details: CoordinateDetails[] = Object.keys(map).map(
      (name, idx) => ({
        name,
        axisId: idx+1,
      })
    );
    setCoordinateDetails(details);
  }, [coordinateNameIdMap]);

  useEffect(() => {
    updateCoordinateDetails(coordinateDetails);
  }, [coordinateDetails, updateCoordinateDetails]);

  useEffect(() => {
    updateJointDetails(jointDetails);
  }, [jointDetails, updateJointDetails]);

  return (
    <TooltipProvider>
      <Canvas
        shadows
        camera={{
          position: camera.position,
          fov: camera.fov,
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x263238);
        }}
      >
        <Suspense fallback={<Loader />}>
          <RobotScene
            robotName={robotName}
            urdfUrl={urdfUrl}
            orbitTarget={orbitTarget}
            setJointDetails={setJointDetails}
            jointStates={jointStates}
            robotConfigMap={robotConfigMap}
          />        
        </Suspense>
      </Canvas>
      <FeedbackPanel
        show={showFeedbackPanel}
        onHide={hideFeedbackPanel}   
        robotName={robotName}   
        jointStates={jointStates}
        coordinateStates={coordinateStates}
        updateJointRadians={updateJointRadians}
        updateCoordinates={updateCoordinates}
      />
        
      <div className="absolute bottom-5 left-0 right-0"> 
        <div className="flex justify-center items-center">
          <div className="flex gap-2 max-w-md">
            <FeedbackButton 
               showFeedbackPanel={showFeedbackPanel}
               onToggleFeedbackPanel={toggleFeedbackPanel}
            />
          </div>
        </div>
      </div>       
    </TooltipProvider>
  );
}

