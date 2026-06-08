// Define camera settings type
type CameraSettings = {
  position: [number, number, number];
  fov: number;
};

// Define combined robot configuration type
export type RobotConfig = {
  urdfUrl: string;
  camera: CameraSettings;
  orbitTarget: [number, number, number];
  jointNameIdMap?: {
    [key: string]: number;
  };
  coordinateNameIdMap?: {
    [key: string]: number;
  };
};

// Define configuration map per slug
export const robotConfigMap: { [key: string]: RobotConfig } = {
  "roarm_m2": {
    urdfUrl: "/URDF/roarm_m2.urdf",  
    camera: { position: [20, 20, 50], fov: 20 },
    orbitTarget: [0, 1, 0],
    jointNameIdMap: {
      base_link_to_link1: 1,
      link1_to_link2: 2,
      link2_to_link3: 3,
      gripper_joint: 4,
    },    
    coordinateNameIdMap: 
    {
      X: 1,
      Y: 2,
      Z: 3,
    },             
  },   
  "roarm_m2_ga": {
    urdfUrl: "/URDF/roarm_m2_ga.urdf",  
    camera: { position: [20, 20, 50], fov: 20 },
    orbitTarget: [0, 1, 0],
    jointNameIdMap: {
      base_link_to_link1: 1,
      link1_to_link2: 2,
      link2_to_link3: 3,
      gripper_joint: 4,
    },    
    coordinateNameIdMap: 
    {
      X: 1,
      Y: 2,
      Z: 3,
    },             
  }, 
  "roarm_m3": {
    urdfUrl: "/URDF/roarm_m3.urdf",  
    camera: { position: [20, 20, 50], fov: 20 },
    orbitTarget: [0, 1, 0],
    jointNameIdMap: {
      base_link_to_link1: 1,
      link1_to_link2: 2,
      link2_to_link3: 3,
      link3_to_link4: 4,
      link4_to_link5: 5,
      link5_to_gripper_link: 6,
    },
    coordinateNameIdMap: 
    {
      X: 1,
      Y: 2,
      Z: 3,
      Roll: 4,
      Pitch: 5,
    },                
  },  
};
