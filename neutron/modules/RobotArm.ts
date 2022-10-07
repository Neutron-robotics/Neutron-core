import { Direction } from "./Robotbase";

interface IFrame {
  id: string;
  name: string;
  build(body: any): IFrameExecutor
}

interface IFrameExecutor {
    id: string;
    methodType: string;
    method: string;
    payload: any;
}

interface IRobotBaseConfiguration {
    frames: IFrame[];
    allowedDirections: Direction[];
}

class RobotBase2 {
  private frames: { [key: string]: IFrame };
  private allowedDirections: Direction[];
  private speed: number = 50;
  private readonly frameMethodType = [
    "move",
  ]

  constructor(configuration: IRobotBaseConfiguration) {
    this.frames = configuration.frames.reduce((acc, frame) => {
        acc[frame.id] = frame;
        return acc;
    }, {} as { [key: string]: IFrame });
    this.allowedDirections = configuration.allowedDirections;
  }

  public move(direction: Direction) {
    if (!this.allowedDirections.includes(direction))
        throw new Error("Invalid direction for move command");

    const frame = this.frames["move"];
    const framePayload = {
        direction: direction,
        speed: this.speed,
    }
    const executor = frame.build(framePayload);
    const response = this.context.execute(executor);    
  }
}

const CERN_robotBaseMoveFrame: IFrame = {
    id: "trhtnh5nryt9n4yn4rn5rny",
    name: "Move",
    build: (body: any) => {
        return {
            id: "move",
            methodType: "publishLoop",
            method: "set_velocity",
            payload: body,
            callback: "setKeepAlive",
        }
    }
    callBackFrames: ["setKeepAlive"],
}