import {
  ConnectionContextType,
  IRobotConnectionInfo,
} from "../interfaces/RobotConnection";
import { IConnectionContext } from "./ConnectionContext";
import { IRosContextConfiguration, RosContext } from "./RosContext";

export const makeConnectionContext = (
  type: ConnectionContextType,
  configuration: IRobotConnectionInfo | IRosContextConfiguration
): IConnectionContext => {
  switch (type) {
    case ConnectionContextType.Ros2:
      return new RosContext(configuration as IRosContextConfiguration);
    default:
      throw new Error("Invalid connection type");
  }
};
