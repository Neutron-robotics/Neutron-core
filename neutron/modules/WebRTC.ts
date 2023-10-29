import { IFrameResult } from "../interfaces/frames";
import { IRobotModuleBuilderArgs, RobotModule } from "./RobotModule";

interface RTCLocalSessionDescriptionInit {
  sdp?: string;
  type?: "answer" | "offer" | "pranswer" | "rollback";
}

export class WebRTC extends RobotModule {
  public readonly type = "webrtc";

  public remoteDescriptors?: RTCLocalSessionDescriptionInit;

  public get isConnected(): boolean {
    return this.context.isConnected;
  }

  constructor(configuration: IRobotModuleBuilderArgs) {
    super(configuration);
  }

  public async makeOffer(sdp: string, type: string): Promise<boolean> {
    const frame = this.frames["negociate"];
    if (!frame) throw new Error("No frame found for stop command");
    const executor = frame.build({
      sdp,
      type,
    });
    // const response = await this.context.execute(executor);
    // this.remoteDescriptors = {
    //   sdp: response.result.sdp,
    //   type: response.result.type,
    // };
    return Promise.resolve(true);
  }

  public async disconnect(): Promise<boolean> {
    const frame = this.frames["stop_camera"];
    if (!frame) throw new Error("No frame found for stop command");
    const executor = frame.build({});
    return Promise.resolve(true);
  }

  public stop(): Promise<IFrameResult> {
    return Promise.resolve({ success: true, result: {} });
  }

  public async destroy(): Promise<void> {
    await this.disconnect();
  }
}
