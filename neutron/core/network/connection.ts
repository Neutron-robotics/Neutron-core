export enum ConnectionContextType {
  Ros2 = 'ros2',
  Tcp = 'tcp',
  WebSocket = 'websocket',
}

export interface NeutronConnectionInfoMessage {
  connectionId: string;
  clients: string[];
  clientsQueue: string[];
  leaderId: string;
}

export interface RobotStatus {
  status: 'Online' | 'Operating' | 'Offline' | 'Unknown';
  battery?: IBatteryStatus;
  system: IRobotSystemStatus;
  location?: IRobotLocationStatus;
  processes?: IRobotProcess[];
  context?: IRobotContextProcess;
}

export interface IRobotProcess {
  cpu: number;
  mem: number;
  mem_usage: number;
  active: boolean;
  pid: number;
  name: string;
  id: string;
}

export interface IRobotContextProcess extends IRobotProcess {
  port: number;
}

export interface IRobotLocationStatus {
  name: string;
}

export interface IBatteryStatus {
  charging: boolean;
  level: number;
}

export interface IRobotSystemStatus {
  cpu: number;
  memory: number;
  latency: number
}
