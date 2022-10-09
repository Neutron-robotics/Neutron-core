import { IFrame, IFrameExecutor } from "../../interfaces/frames";
import {
  IRosFrameExecutorPeriodConfig,
  makeFrameExecutor,
} from "../makeFrameExecutor";

const keepAliveFrame: IFrame = {
  id: "keepAlive",
  name: "Keep Alive",
  build: (_: any): IFrameExecutor => {
    const configuration: IRosFrameExecutorPeriodConfig = {
      method: "sendLoop",
      methodType: "keep_alive",
      format: "std_msgs/String",
      period: 3,
    };

    return makeFrameExecutor(configuration, {});
  },
};

export { keepAliveFrame };
