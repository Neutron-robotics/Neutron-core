import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const setResolutionFrame: IFrame = {
  id: "set_resolution",
  name: "Set Resolution",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "request",
      methodType: "/set_resolution",
      format: "myrobotics_protocol/srv/GlobalSetValue",
    };

    const i = body.resolutions.indexOf(body.targetResolution);
    if (i === -1) {
      console.log(
        "could not find res",
        body.targetResolution,
        " in ",
        body.activeResolution
      );
    }

    return makeFrameExecutor(configuration, {
      value: i,
    });
  },
};

export { setResolutionFrame };
