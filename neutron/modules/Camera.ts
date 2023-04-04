import { CameraInfoUpdate, Resolution } from "../interfaces/camera";
import { IFrameResult } from "../interfaces/frames";
import { ILiteEvent, LiteEvent } from "../utils/LiteEvent";
import { IRobotModuleBuilderArgs, RobotModule } from "./RobotModule";

export interface ICameraConfiguration {
  ip: string;
  available_resolutions: Resolution[];
}

export class Camera extends RobotModule {
  public readonly type = "camera";

  public get uri(): string {
    return `http://${this.context.hostname}:8100`;
  }

  public readonly resolutions: Resolution[];

  public activeResolution?: Resolution;

  public fps: number | undefined;

  public ip: string;

  public infoUpdated: ILiteEvent<CameraInfoUpdate>;

  //tmp, later to be replaced by a proper status
  public get isConnected(): boolean {
    return this.context.isConnected;
  }

  constructor(configuration: ICameraConfiguration & IRobotModuleBuilderArgs) {
    super(configuration);
    this.ip = configuration.ip;
    this.resolutions = configuration.available_resolutions;
    this.infoUpdated = new LiteEvent<CameraInfoUpdate>();
    const frame = this.frames["camera_info"];
    this.context.on(frame.build({}), this.handleCameraInfo);
  }

  public async setResolution(resolution: Resolution): Promise<boolean> {
    const frame = this.frames["set_resolution"];
    if (!frame) throw new Error("No frame found for fps command");
    if (resolution === this.activeResolution) {
      return true;
    }
    const executor = frame.build({
      activeResolution: this.activeResolution,
      resolutions: this.resolutions,
      targetResolution: resolution,
    });
    const response = await this.context.execute(executor);
    return response.success;
  }

  public async setFps(fps: number): Promise<boolean> {
    const frame = this.frames["set_fps"];
    if (!frame) throw new Error("No frame found for fps command");
    const executor = frame.build({
      fps,
    });
    const response = await this.context.execute(executor);
    return response.success;
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

  private handleCameraInfo = (infos: CameraInfoUpdate): void => {
    this.fps = infos.fps;
    this.activeResolution = infos.resolution;
    this.infoUpdated.trigger(infos);
  };
}
