"use client";

import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import useMeasure from "react-use-measure";

import {
  JointState,
  CoordinateState,
  UpdateJointRadians,
  UpdateCoordinates,
} from "@/hooks/updateRobotFeedback"; 

import { panelStyle } from "@/components/playground/panelStyle";
import { FeedbackTable  } from "@/components/playground/FeedbackPanels/FeedbackTable";

// --- Feedback Panel Component ---
type FeedbackPanelProps = {
  onHide?: () => void; 
  show?: boolean; 
  robotName: string;
  jointStates: JointState[]; 
  coordinateStates: CoordinateState[];
  updateJointRadians: UpdateJointRadians; 
  updateCoordinates:UpdateCoordinates;
};

export function FeedbackPanel({
  show = true,
  onHide,
  robotName,
  jointStates,
  coordinateStates,
  updateJointRadians,
  updateCoordinates,
}: FeedbackPanelProps) {

  const [ref, bounds] = useMeasure();
  const [hasDragged, setHasDragged] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (bounds.height > 0 && !hasDragged) {
      setPosition((pos) => ({
        ...pos,
        x: window.innerWidth - bounds.width - 20,
        y: window.innerHeight - bounds.height - 20,
      }));
    }
  }, [bounds.height, hasDragged]);
          
  // Separate jointStates into revolute and continuous categories
  const revoluteJoints = jointStates.filter(
    (state) => state.jointType === "revolute"
  );

  return (
    <Rnd
      position={position}
      onDragStop={(_, d) => {
        setPosition({ x: d.x, y: d.y });
        setHasDragged(true);
      }}
      bounds="window"
      className="z-50"
      style={{ display: show ? undefined : "none" }}
      dragHandleClassName="drag-handle" 
    >
    <div
        ref={ref}
        className={"max-h-[90vh] overflow-y-auto text-sm " + panelStyle}
      >
        <h3 className=" drag-handle mt-0 mb-4 border-b border-zinc-600 pb-1 font-bold text-base flex justify-between items-center" style={{ cursor: 'move' }}>
        <span className=" drag-handle" style={{ cursor: 'move' }}>Feedback</span>

        <button
          onClick={onHide}
          onTouchEnd={onHide}
          className="ml-2 text-xl hover:bg-zinc-800 px-2 rounded-full"
          title="Collapse"
        >
          ×
        </button>
      </h3>
      {/* Revolute Joints Table */}
      {revoluteJoints.length > 0 && (
        <FeedbackTable
          robotName={robotName}
          joints={revoluteJoints}
          coordinates={coordinateStates}
          updateJointRadians={updateJointRadians}
          updateCoordinates={updateCoordinates}
        />
      )}

    </div>
    </Rnd>  
  );
}
