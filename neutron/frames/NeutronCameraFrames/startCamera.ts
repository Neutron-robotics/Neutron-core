import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const startCameraFrame: IFrame = {
  id: "start_camera",
  name: "Start Camera",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "request",
      methodType: "/start_camera",
      format: "myrobotics_protocol/srv/GlobalResult",
    };
    return makeFrameExecutor(configuration, {});
  },
};

export { startCameraFrame };
