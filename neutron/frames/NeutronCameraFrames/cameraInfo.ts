import { CameraInfoUpdate } from "../../interfaces/camera";
import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const cameraInfoFrame: IFrame = {
  id: "camera_info",
  name: "Camera infos",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "on",
      methodType: "/camera_infos",
      format: "myrobotics_protocol/msg/CameraInfo",
    };

    const transformer = (message: any) => {
      body.callback({
        resolution: message.resolution,
        fps: message.fps,
        active: message.on,
      });
    };

    return makeFrameExecutor(configuration, {
      callback: transformer,
    });
  },
};

export { cameraInfoFrame };
