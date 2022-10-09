import { IFrame } from "../../interfaces/frames";
import {
  IRosFrameExecutorConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const stopFrame: IFrame = {
  id: "stop",
  name: "Stop",
  build: (body: any) => {
    const configuration: IRosFrameExecutorConfig = {
      method: "send",
      methodType: "set_velocity",
      format: "std_msgs/String",
    };
    return makeFrameExecutor(
      configuration,
      {},
      {
        loopCancellationToken: "keep_alive",
      }
    );
  },
};

export { stopFrame };
