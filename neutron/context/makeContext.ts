import { IRobotConnectionInfo, RobotConnectionType } from "../interfaces/RobotConnection";
import { IConnectionContext } from "./ConnectionContext";
import { RosContext } from "./RosContext";

export const makeConnectionContext = (
    type: RobotConnectionType,
    configuration: IRobotConnectionInfo
  ): IConnectionContext => {
    switch (type) {
      case RobotConnectionType.ROSBRIDGE:
        return new RosContext(configuration);
      default:
        throw new Error("Invalid connection type");
    }
  };