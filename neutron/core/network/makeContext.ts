import {
  ConnectionContextType, RobotConnectionInfo,
} from "../../interfaces/RobotConnection";
import RosContext, { RosContextConfiguration } from "./RosContext";
import NeutronConnectionContext from "./NeutronConnectionContext";

export const makeConnectionContext = (
  type: ConnectionContextType,
  configuration: RobotConnectionInfo | RosContextConfiguration
): NeutronConnectionContext => {
  switch (type) {
    case ConnectionContextType.Ros2:
      return new RosContext(configuration as RosContextConfiguration);
    default:
      throw new Error("Invalid connection type");
  }
};
