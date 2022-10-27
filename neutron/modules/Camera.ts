import { ServiceResponse } from "roslib";
import { IConnectionContext } from "../context/ConnectionContext";
import { IFrame } from "../interfaces/frames";
import { IRobotModule } from "../interfaces/RobotConnection";
import { v4 as uuid} from "uuid";

export interface ICameraConfiguration {
  ip: string;
}

export class Camera implements IRobotModule {
  public readonly type = "camera";

  public isConnected: boolean;

  public id: string;

  public name: string;

  public get uri(): string {
    return `http://${this.context.hostname}:8100`;
  }

  public configuration: ICameraConfiguration;

  private context: IConnectionContext;

  private frames: { [key: string]: IFrame };

  constructor(
    name: string,
    configuration: ICameraConfiguration,
    context: IConnectionContext,
    frames: IFrame[]
  ) {
    this.id = uuid();
    this.name = name;
    this.isConnected = false;
    this.configuration = configuration;
    this.context = context;
    this.frames = frames.reduce((acc, frame) => {
      acc[frame.id] = frame;
      return acc;
    }, {} as { [key: string]: IFrame });
  }

  public async connect(): Promise<boolean> {
    const frame = this.frames["start_camera"];
    if (!frame) throw new Error("No frame found for start command");
    const executor = frame.build({});
    const response = await this.context.execute(executor);
    return response.success;
  }

  public async disconnect(): Promise<boolean> {
    const frame = this.frames["stop_camera"];
    if (!frame) throw new Error("No frame found for stop command");
    const executor = frame.build({});
    const response = await this.context.execute(executor);
    return response.success;
  }
}
