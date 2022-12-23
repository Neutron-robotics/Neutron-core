import { ServiceResponse } from "roslib";
import { IConnectionContext } from "../context/ConnectionContext";
import { IFrame, IFrameResult } from "../interfaces/frames";
import { IRobotModule } from "../interfaces/RobotConnection";
import { v4 as uuid } from "uuid";
import { IRobotModuleBuilderArgs, RobotModule } from "./RobotModule";

export interface ICameraConfiguration {
  ip: string;
}

export class Camera extends RobotModule {
  public readonly type = "camera";

  public name: string;

  public get uri(): string {
    return `http://${this.context.hostname}:8100`;
  }

  public ip: string;

  //tmp, later to be replaced by a proper status
  public get isConnected(): boolean {
    return this.context.isConnected;
  }

  protected context: IConnectionContext;

  protected frames: Record<string, IFrame>;

  constructor(configuration: ICameraConfiguration & IRobotModuleBuilderArgs) {
    super(configuration);
    this.ip = configuration.ip;
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

  public stop(): Promise<IFrameResult> {
    return Promise.resolve({ success: true, result: {} });
  }

  public async destroy(): Promise<void> {
    await this.disconnect();
  }
}
