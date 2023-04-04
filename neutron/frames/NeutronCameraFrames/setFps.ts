import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const setFpsFrame: IFrame = {
  id: "set_fps",
  name: "Set FPS",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "request",
      methodType: "/set_fps",
      format: "myrobotics_protocol/srv/GlobalSetValue",
    };

    return makeFrameExecutor(configuration, {
      value: body.fps,
    });
  },
};

export { setFpsFrame };
