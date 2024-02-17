import RosContext, { RosContextConfiguration } from "./RosContext";
import NeutronConnectionContext from "./NeutronConnectionContext";

export enum ConnectionContextType {
  Ros2 = "ros2",
  Tcp = "tcp",
  WebSocket = "websocket",
}

export interface RobotConnectionInfo {
  hostname: string;
  port: number;
  type: ConnectionContextType;
}

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
