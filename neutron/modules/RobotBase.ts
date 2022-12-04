import { IConnectionContext } from "../context/ConnectionContext";
import { IFrame, IFrameResult } from "../interfaces/frames";
import { IMovementMatrix } from "../interfaces/robotbase";
import { inRange } from "../utils/math";
import { v4 as uuid } from "uuid";
import { IRobotModuleBuilderArgs, RobotModule } from "./RobotModule";

export interface IRobotBaseConfiguration {
  directionnalSpeed: number;
  rotationSpeed: number;
}

export class RobotBase extends RobotModule {
  public readonly type = "robotbase";

  protected context: IConnectionContext;

  protected frames: Record<string, IFrame>

  public id: Lowercase<string>;

  public name: string;

  public configuration: IRobotBaseConfiguration;

  public speed: number;

  constructor(
    configuration: IRobotBaseConfiguration & IRobotModuleBuilderArgs
  ) {
    super(configuration);
    this.configuration = {
      directionnalSpeed: configuration.directionnalSpeed,
      rotationSpeed: configuration.rotationSpeed,
    };
    if (
      !inRange(configuration.directionnalSpeed, 0, 1) ||
      !inRange(configuration.rotationSpeed, 0, 1)
    )
      throw new Error("Invalid speed configuration: speed range is [0, 1]");
    this.speed = 50;
  }

  public async move(movement: number[], speed = this.speed) {
    const frame = this.frames["move"];
    if (!frame) throw new Error("No frame found for move command");
    const scaledMovement = [
      movement[0] * this.configuration.directionnalSpeed * speed,
      movement[1] * this.configuration.directionnalSpeed * speed,
      0,
      0,
      0,
      movement[5] * this.configuration.rotationSpeed * speed,
    ];
    const framePayload: IMovementMatrix = {
      x: scaledMovement[0],
      y: scaledMovement[1],
      z: 0,
      pitch: 0,
      roll: 0,
      yaw: scaledMovement[5],
    };
    const executor = frame.build(framePayload);
    const response = await this.context.execute(executor);
    return response;
  }

  public stop(): Promise<IFrameResult> {
    const frame = this.frames["stop"];
    if (!frame) throw new Error("No frame found for stop command");
    const executor = frame.build({});
    const response = this.context.execute(executor);
    return response;
  }

  public override destroy(): Promise<void> {
    return Promise.resolve();
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
    const frame = this.frames["speed"];
    if (!frame) throw new Error("No frame found for speed command");
    const executor = frame.build({ speed });
    this.context.execute(executor);
  }
}
