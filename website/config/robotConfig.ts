// Define camera settings type
type CameraSettings = {
  position: [number, number, number];
  fov: number;
};

// Define a type for compound/linked joint movements
type CompoundMovement = {
  name: string;
  keys: string[]; // keys that trigger this movement
};

// Define combined robot configuration type
export type RobotConfig = {
  urdfUrl: string;
  camera: CameraSettings;
  orbitTarget: [number, number, number];
  keyboardControlMap?: {
    [key: string]: string[];
  };
  jointNameIdMap?: {
    [key: string]: number;
  };
  compoundMovements?: CompoundMovement[];
  controlPrompt?: string;
  systemPrompt?: string; // <-- Add this line
};

// Define configuration map per slug
export const robotConfigMap: { [key: string]: RobotConfig } = {
  "roarm_m3": {
    urdfUrl: "/URDF/roarm_m3.urdf",  
    camera: { position: [-20, 10, -15], fov: 20 },
    orbitTarget: [0, 1, 0],
    keyboardControlMap: {
      1:  ["1","r"],
      2:  ["2","r"],
      3:  ["3","r"],
      4:  ["4","r"],
      5:  ["5","r"],
      6:  ["g","r"],
    },
    jointNameIdMap: {
      base_link_to_link1: 1,
      link1_to_link2: 2,
      link2_to_link3: 3,
      link3_to_link4: 4,
      link4_to_link5: 5,
      link5_to_gripper_link: 6,
    },
    compoundMovements: [
      // Jaw compound movements
      {
        name: "X backward & forward",
        keys: ["x","r"],
      },
      {
        name: "Y backward & forward",
        keys: ["y","r"],
      },
      {
        name: "Z backward & forward",
        keys:  ["z","r"],
      },            
    ],
    systemPrompt: `You can help control the roarm_m3 robot by pressing keyboard keys. Use the keyPress tool to simulate key presses. Each key will be held down for 1 second by default. If the user describes roughly wanting to make it longer or shorter, adjust the duration accordingly.
    The robot can be controlled with the following keys:
    - "1" to "5" for moving the robot's joints.
    - "g" for moving the gripper.
    - "x" for moving the gripper backward and forward.
    - "y" for moving the gripper left and right.
    - "z" for moving the gripper up and down.
    - "r" to reverse the movement direction, default is forward.
    `,
  },  
};
