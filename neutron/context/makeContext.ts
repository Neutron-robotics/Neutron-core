import {
  IRobotConnectionInfo,
  RobotConnectionType,
} from "../interfaces/RobotConnection";
import { IConnectionContext } from "./ConnectionContext";
import { IRosContextConfiguration, RosContext } from "./RosContext";

export const makeConnectionContext = (
  type: RobotConnectionType,
  configuration: IRobotConnectionInfo | IRosContextConfiguration
): IConnectionContext => {
  switch (type) {
    case RobotConnectionType.ROSBRIDGE:
      return new RosContext(configuration as IRosContextConfiguration);
    default:
      throw new Error("Invalid connection type");
  }
};
