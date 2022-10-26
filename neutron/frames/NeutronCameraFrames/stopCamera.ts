import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const stopCameraFrame: IFrame = {
  id: "stop_camera",
  name: "Stop Camera",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "request",
      methodType: "/stop_camera",
      format: "myrobotics_protocol/srv/GlobalResult",
    };
    return makeFrameExecutor(configuration, {});
  },
};

export { stopCameraFrame };
