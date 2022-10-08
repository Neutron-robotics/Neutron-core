export type Direction = "forward" | "backward" | "left" | "right";
export type Rotation = "left" | "right";

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