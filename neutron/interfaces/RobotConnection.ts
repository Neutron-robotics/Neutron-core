interface IRobotConnectionConfiguration {
  id: string;
  name: string;
  type: string;
  batteryInfo: IBatteryInfo;
  status: RobotStatus;
  context: RobotConnectionInfo;
  core: RobotConnectionInfo;

  modules: IRobotModule[];
}

interface RobotConnectionInfo {
  hostname: string;
  port: number;
  type: ConnectionContextType;
}

enum ConnectionContextType {
  Ros2 = "ros2",
  Tcp = "tcp",
  WebSocket = "websocket",
}

const getRobotConnectionTypeFromString = (
  type: string
): ConnectionContextType => {
  switch (type.toUpperCase()) {
    case "TCP":
      return ConnectionContextType.Tcp;
    case "WEBSOCKET":
      return ConnectionContextType.WebSocket;
    case "ROS2":
      return ConnectionContextType.Ros2;
    default:
      throw new Error(`Unknown robot connection type: ${type}`);
  }
};

enum RobotStatus {
  Disconnected = "Disconnected",
  Available = "Available",
  Connected = "Connected",
  Busy = "Busy",
  Error = "Error",
}

interface IBatteryInfo {
  level: number;
  measurement: "percent" | "volt";
  charging: boolean;
}

interface IRobotModule {
  id: string;
  name: string;
  type: string;
}

interface IRobotModuleDefinition extends IRobotModule {
  configuration: unknown;
  framePackage: string;
}

export type {
  IRobotConnectionConfiguration,
  IRobotModule,
  IBatteryInfo,
  RobotConnectionInfo,
  IRobotModuleDefinition
};

export { RobotStatus, ConnectionContextType, getRobotConnectionTypeFromString };
