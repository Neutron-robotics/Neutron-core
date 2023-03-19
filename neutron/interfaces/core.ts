import { IRobotModuleDefinition } from "./RobotConnection";

export interface ICoreProcess {
  cpu: number;
  mem: number;
  mem_usage: number;
  active: boolean;
  pid: number;
  name: string;
  id: string;
}

export interface ICoreModule extends IRobotModuleDefinition {
  process?: ICoreProcess;
}

export interface IRobotStatus {
  battery: number;
  cpu: number;
  memory: number;
  operationTime: number;
  time: number;
  modules: ICoreModule[];
}
