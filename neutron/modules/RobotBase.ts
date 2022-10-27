import { IConnectionContext } from "../context/ConnectionContext";
import { IFrame, IFrameResult } from "../interfaces/frames";
import { IMovementMatrix } from "../interfaces/robotbase";
import { IRobotModule } from "../interfaces/RobotConnection";
import { inRange } from "../utils/math";
import { v4 as uuid} from "uuid";

export interface IRobotBaseConfiguration {
  directionnalSpeed: number;
  rotationSpeed: number;
}

export class RobotBase implements IRobotModule {
  public readonly type = "robotbase";

  private context: IConnectionContext;

  private frames: { [key: string]: IFrame };

  public id: string;

  public name: string;

  public configuration: IRobotBaseConfiguration;

  public speed: number;

  constructor(
    name: string,
    configuration: IRobotBaseConfiguration,
    context: IConnectionContext,
    frames: IFrame[]
  ) {
    this.id = uuid();
    this.name = name;
    this.frames = frames.reduce((acc, frame) => {
      acc[frame.id] = frame;
      return acc;
    }, {} as { [key: string]: IFrame });
    this.context = context;
    this.configuration = configuration;
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

  public setSpeed(speed: number): void {
    this.speed = speed;
    const frame = this.frames["speed"];
    if (!frame) throw new Error("No frame found for speed command");
    const executor = frame.build({ speed });
    this.context.execute(executor);
  }
}
