import { ICoreProcess } from "../../interfaces/core";

interface IRobotStatusMessage {
  battery: number;
  cpu: number;
  memory: number;
  operationTime: number;
  modules: ICoreProcess[];
}

export default IRobotStatusMessage;
