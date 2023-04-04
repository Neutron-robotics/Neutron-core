import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const negociate: IFrame = {
  id: "negociate",
  name: "Negociate",
  build: (body: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "request",
      methodType: "/negociate",
      format: "myrobotics_protocol/srv/WebRTCNegociation",
    };
    return makeFrameExecutor(configuration, {
        sdp: body.sdp,
        type: body.type
    });
  },
};

export { negociate };
