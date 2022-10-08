import { IConnectionContext } from "../context/ConnectionContext";
import { RosContext } from "../context/RosContext";
import { IFrame } from "../interfaces/frames";
import {
  IRobotBaseCartesianMovement,
  IMovementMatrix,
} from "../interfaces/robotbase";
import { IBatteryInfo } from "../interfaces/RobotConnection";
import { inRange } from "../utils/math";
import { Direction, IRobotBaseConfiguration } from "./Robotbase";

export class RobotBase {
  private context: IConnectionContext;

  private frames: { [key: string]: IFrame };

  private allowedDirections: Direction[];

  public id: string;

  public name: string;

  public configuration: IRobotBaseConfiguration;

  public batteryInfo: IBatteryInfo;

  public speed: number;

  constructor(
    configuration: IRobotBaseConfiguration,
    context: IConnectionContext,
    frames: IFrame[]
  ) {
    this.frames = frames.reduce((acc, frame) => {
      acc[frame.id] = frame;
      return acc;
    }, {} as { [key: string]: IFrame });
    this.context = context;
    this.name = configuration.name;
    this.configuration = configuration;
    if (
      !inRange(configuration.directionnalSpeed, 0, 1) ||
      !inRange(configuration.rotationSpeed, 0, 1)
    )
      throw new Error("Invalid speed configuration: speed range is [0, 1]");
    this.id = configuration.id;
    this.batteryInfo = {
      level: -1,
      measurement: "percent",
      charging: false,
    };
    this.speed = 50;
  }

  public async move(movement: IRobotBaseCartesianMovement, speed?: number) {
    if (!this.allowedDirections.includes(movement.direction))
      throw new Error("Invalid direction for move command");

    const frame = this.frames["move"];
    if (!frame) throw new Error("No frame found for move command");
    const framePayload: IMovementMatrix = {
      x: movement.direction === "forward" ? 1 : -1,
      y: movement.direction === "left" ? 1 : -1,
      z: 0,
      pitch: 0,
      roll: 0,
      yaw: movement.rotation === "right" ? 1 : -1,
    };
    const executor = frame.build(framePayload);
    const response = await this.context.execute(executor);
    return response;
  }

  //todo: set this async
  public stop() {
    const frame = this.frames["stop"];
    if (!frame) throw new Error("No frame found for stop command");
    const executor = frame.build({});
    const response = this.context.execute(executor);
    return response;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
    const frame = this.frames["speed"];
    if (!frame) throw new Error("No frame found for speed command");
    const executor = frame.build({ speed });
    this.context.execute(executor);
  }
}
