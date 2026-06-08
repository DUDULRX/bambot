/**
 * Control virtual degree with this hook, the real degree is auto managed
 */

import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export type JointDetails = {
  name: string;
  servoId: number;
  jointType: "revolute";
  limit?: {
    lower?: number;
    upper?: number;
  };
};

export type CoordinateDetails = {
  name: string;
  axisId: number;
};

export type JointState = {
  name: string;
  servoId?: number;
  jointType: "revolute";
  limit?: { lower?: number; upper?: number };
  realRadians?: number;
};

export type CoordinateState = {
  name: string;
  axisId: number;
  realCoordinates?: number;
};

export type UpdateJointRadians = (
  updates: { servoId: number; value: number }[]
) => Promise<void>;

export type UpdateCoordinates = (
  updates: { axisId: number; value: number }[]
) => Promise<void>;

// -------------------------------------
export function updateJointStatesBySocket(
  updateJointRadians: UpdateJointRadians,
  updateCoordinates: UpdateCoordinates,
  robotName: string
) {
  useEffect(() => {
    console.log("Socket initializing for robot:", robotName);

    const host = window.location.hostname;
    const socket = io(`http://${host}:5000/arm_state_update`, {
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("Connected to arm_state socket");
    });

    socket.on("connect", () => {
      console.log("Connected to /arm_state_update namespace");
    });

    function handleArmData(data: any,robotName: string) {
      console.log("Received arm data:", data);

      const coordinates = [];
      const joints = [];

      if ("b" in data) joints.push({ servoId: 1, value: data.b ?? 0  });
      if ("s" in data) joints.push({ servoId: 2, value: data.s ?? 0  });
      if ("e" in data) joints.push({ servoId: 3, value: data.e ?? 0  });

      if ("x" in data) coordinates.push({ axisId: 1, value: data.x ?? 0  });
      if ("y" in data) coordinates.push({ axisId: 2, value: data.y ?? 0  });
      if ("z" in data) coordinates.push({ axisId: 3, value: data.z ?? 0  });

      if (robotName === "roarm_m2" || robotName === "roarm_m2_ga") {
        if ("t" in data) joints.push({ servoId: 4, value: 3.1416-(data.t ?? 0)});
      }else if (robotName === "roarm_m3") {
        if ("t" in data) joints.push({ servoId: 4, value: data.t ?? 0  });
        if ("r" in data) joints.push({ servoId: 5, value: data.r ?? 0  });
        if ("g" in data) joints.push({ servoId: 6, value: 3.1416-(data.g ?? 0)});
        if ("r" in data) coordinates.push({ axisId: 4, value: data.r ?? 0  });
        if ("tit" in data) coordinates.push({ axisId: 5, value: data.tit ?? 0  });
      }

      updateCoordinates(coordinates);
      updateJointRadians(joints);
    }

    socket.on("arm_state_update", (data) => handleArmData(data, robotName));

    return () => {
      socket.close();
    };

  }, []); 
}

export function updateRobotFeedback(
  initialJointDetails: JointDetails[],
  initialCoordinateDetails: CoordinateDetails[],
) {
  const [jointDetails, setJointDetails] = useState(initialJointDetails);
  const [coordinateDetails, setCoordinateDetails] = useState(initialCoordinateDetails);

  // Joint states
  const [jointStates, setJointStates] = useState<JointState[]>(
    jointDetails.map((j, index) => ({
      jointType: j.jointType,
      realRadians: 0,
      servoId: j.servoId,
      name: j.name, 
      limit: j.limit, 
    }))
  );

  const [coordinateStates, setCoordinateStates] = useState<CoordinateState[]>(
    coordinateDetails.map((j, index) => ({
      realCoordinates:  0,
      axisId: j.axisId, 
      name: j.name, 
    }))
  );

  useEffect(() => {
    setJointStates(
      jointDetails.map((j, index) => ({
        jointType: j.jointType,
        realRadians: 0,
        servoId: j.servoId, 
        name: j.name, 
        limit: j.limit,
      }))
    );
  }, [jointDetails]);

  useEffect(() => {
    setCoordinateStates(
      coordinateDetails.map((j, index) => ({
        realCoordinates:  0,
        axisId: j.axisId, 
        name: j.name, 
      }))
    );
  }, [coordinateDetails]);

  const updateJointRadians: UpdateJointRadians = useCallback(
    async (updates) => {
      const newStates = [...jointStates];

      updates.forEach(({ servoId, value }) => {

        const jointIndex = newStates.findIndex(
          (state) => state.servoId === servoId
        );

        if (jointIndex !== -1) {
          newStates[jointIndex].realRadians = value;
        }
      });

      setJointStates(newStates);
    },
    [jointStates]
  );

  const updateCoordinates: UpdateCoordinates = useCallback(
    async (updates) => {
      setCoordinateStates((prevStates) => {
        const newStates = [...prevStates];
        updates.forEach(({ axisId, value }) => {
          if (typeof axisId !== 'number') return;
          const jointIndex = newStates.findIndex(
            (state) => state.axisId === axisId
          );
          if (jointIndex !== -1) {
            newStates[jointIndex].realCoordinates = value;
          }
        });
        return newStates;
      });
    },
    [] 
  );

  return {
    jointStates,
    coordinateStates,
    updateJointStatesBySocket,
    updateJointRadians,
    updateCoordinates,
    setJointDetails,
    setCoordinateDetails,
  };
}