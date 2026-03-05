"use client";
import { useEffect, useRef } from "react"; // Added useRef

import { radiansToDegrees } from "@/lib/utils";

import {
  JointState,
  CoordinateState,
  UpdateJointRadians,
  UpdateCoordinates,
  updateJointStatesBySocket,
} from "@/hooks/updateRobotFeedback";

type FeedbackTableProps = {
  robotName: string;
  joints: JointState[];
  coordinates: CoordinateState[];
  updateJointRadians: UpdateJointRadians;
  updateCoordinates: UpdateCoordinates;
};

const formatValue = (
  value?: number | "N/A" | "error",
  unit = "",
  isAngle = false,
  isVirtual = false
) => {
  if (value === "error") return <span className="text-red-500">Error</span>;
  if (value === "N/A") return "/";
  if (typeof value === "number") {
    let displayValue = value;
    if (isAngle) displayValue = (value * 180) / Math.PI;
    let prefix = isVirtual && value > 0 ? "+" : "";
    return `${prefix}${displayValue.toFixed(1)}${unit}`;
  }
  return "/";
};

export function FeedbackTable({
  robotName,
  joints,
  coordinates,
  updateJointRadians,
  updateCoordinates,
}: FeedbackTableProps) {
  
  // Refs to hold the latest values needed inside the interval callback
  const jointsRef = useRef(joints);
  const coordinatesRef = useRef(coordinates);
  const updateJointsRadiansRef = useRef(updateJointRadians);
  const updateCoordinatesRef = useRef(updateCoordinates);

  updateJointStatesBySocket(updateJointRadians, updateCoordinates,robotName);
  
  // Update refs whenever the props change
  useEffect(() => {
    jointsRef.current = joints;
    coordinatesRef.current = coordinates;
  }, [joints, coordinates]);

  useEffect(() => {
    updateJointsRadiansRef.current = updateJointRadians;
    updateCoordinatesRef.current = updateCoordinates;
  }, [updateJointRadians, updateCoordinates]);

  // Component rendering uses the `joints` prop for display
  return (
    <div className="mt-4">
      <table className="table-auto w-full text-left text-sm">
        <thead>
          {/* ... existing table head ... */}
          <tr>
            <th className="border-b border-gray-600 pb-1 pr-2">Joint</th>
          </tr>
        </thead>
        <tbody>
          {joints.map((detail) => {
            return (
              <tr key={detail.servoId}>
                <td className="">
                  {detail.name}
                </td>

                <td className="pl-2 text-center w-16">
                  {formatValue(radiansToDegrees(detail.realRadians), "°", false, false)}
                </td>
                <td className="py-1 px-4 flex items-center">
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Display CoordinateName if present */}
        <div className="mt-4">
          <table className="table-auto w-full text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-gray-600 pb-2 pr-2">
                  Coordinate
                </th>           
              </tr>
            </thead>

            <tbody>
              {coordinates.map((detail) => {
                return (
                  <tr key={detail.axisId}>
                    <td className="">
                      {detail.name}
                    </td>

                    <td className="pl-2 text-center w-16">
                      {detail.axisId <= 3
                      ? formatValue(detail.realCoordinates, "mm", false, true) 
                      : formatValue(detail.realCoordinates, "°", true, false)} 
                    </td>
                    <td className="py-1 px-4 flex items-center">
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      <style jsx global>{`
        .custom-range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .custom-range-thumb::-moz-range-thumb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .custom-range-thumb::-ms-thumb {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
        }
        .custom-range-thumb {
          /* Remove default styles for Firefox */
          overflow: hidden;
        }
        input[type="range"].custom-range-thumb {
          /* Remove default focus outline for Chrome */
          outline: none;
        }
      `}</style>
    </div>
  );
}
