import {
  IFrame,
  IFrameExecutor,
  IRosFrameExecutor,
} from "../../interfaces/frames";
import { IMovementMatrix } from "../../interfaces/robotbase";
import { IRosFrameExecutorConfig, makeFrameExecutor } from "../makeFrameExecutor";
import { keepAliveFrame } from "./keepAliveFrame";

const moveFrame: IFrame = {
  id: "move",
  name: "Move",
  build: (body: IMovementMatrix): IFrameExecutor => {
    const configuration: IRosFrameExecutorConfig = {
      method: "send",
      methodType: "set_velocity",
      format: "myrobotics_protocol/msg/Velocity",
    };

    return makeFrameExecutor(configuration, body, {
      chainWith: keepAliveFrame,
    });
  },
};

export { moveFrame };
