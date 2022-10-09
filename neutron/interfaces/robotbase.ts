export type Direction = "forward" | "backward" | "left" | "right";
export type Rotation = "anticlockwise" | "clockwise";

export interface IRobotBaseCartesianMovement {
    direction: Direction;
    speed: number;
    rotation: Rotation;
    rotationSpeed: number;
}

export interface IMovementMatrix {
    x: number;
    y: number;
    z: number;
    pitch: number;
    roll: number;
    yaw: number;
}