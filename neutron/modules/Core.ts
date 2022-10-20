import axios, { AxiosInstance } from "axios";
import { v4 } from "uuid";
import {
  getRobotConnectionTypeFromString,
  IRobotConnectionConfiguration,
  IRobotConnectionInfo,
  IRobotModule,
  RobotConnectionType,
  RobotStatus,
} from "../interfaces/RobotConnection";

export interface ICoreProcess {
  cpu: number;
  mem: number;
  mem_usage: number;
  active: boolean;
  pid: number;
  name: string;
  id: string;
}

export interface ICoreModule extends IRobotModule {
  process?: ICoreProcess;
}

export class Core {
  private connection: IRobotConnectionInfo;
  private axios: AxiosInstance;

  public readonly id: string = v4();

  public name: string;

  public type: string;

  public status: RobotStatus;

  public contextConfiguration: IRobotConnectionInfo;

  public battery: number;

  public modules: ICoreModule[];

  public get connectionConfiguration(): IRobotConnectionConfiguration {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      batteryInfo: {
        level: this.battery,
        measurement: "percent",
        charging: false,
      },
      status: this.status,
      context: {
        hostname: this.contextConfiguration.hostname,
        port: this.contextConfiguration.port,
        type: this.contextConfiguration.type,
      },
      core: {
        hostname: this.connection.hostname,
        port: this.connection.port,
        type: this.connection.type,
      },
      modules: this.modules,
    };
  }

  constructor(connection: IRobotConnectionInfo) {
    this.connection = connection;
    this.axios = axios.create({
      baseURL: `http://${connection.hostname}:${connection.port}`,
      timeout: 1000,
    });
    this.name = "";
    this.type = "";
    this.status = RobotStatus.Disconnected;
    this.battery = -1;
    this.modules = [];
    this.contextConfiguration = {
      hostname: "",
      port: -1,
      type: RobotConnectionType.HTTP,
    };
  }

  public getConnectionInfo = async (): Promise<void> => {
    const response = await this.axios.get("/robot/configuration");
    const data = response.data;
    const payload = data.robot;
    if (!payload) throw new Error("No robot configuration found");

    this.name = payload.name;
    this.type = payload.type;
    this.status = payload.status;
    this.battery = payload.battery;
    this.contextConfiguration = {
      hostname: this.connection.hostname,
      port: payload.connection.port,
      type: getRobotConnectionTypeFromString(payload.connection.type),
    };
    this.modules = payload.modules.map((module: IRobotModule) => {
      const process = this.modules.find((m) => m.id === module.id)?.process;
      return {
        ...module,
        process: process,
      };
    });
  };

  public getProcessesStatus = async (): Promise<void> => {
    const response = await this.axios.get("/robot/status");
    console.log(response);
    const data = response.data as ICoreProcess[];

    this.modules = this.modules.map((module: ICoreModule) => {
      const process = data.find((p) => p.id === module.id);
      return {
        ...module,
        process: process,
      };
    });
  };

  public startProcesses = async (timeout?: number): Promise<boolean> => {
    await this.getProcessesStatus();
    const res = (
      await Promise.all(
        this.modules.map((module) => this.startRobotProcess(module.id, timeout))
      )
    ).reduce((acc, val) => acc && val, true);
    await this.getProcessesStatus();
    return res;
  };

  public startRobotProcess = async (
    id: string,
    timeout?: number
  ): Promise<boolean> => {
    try {
      const module = this.modules.find((m) => m.id === id);
      if (!module) throw new Error("Module not found");
      if (module?.process?.active) return true;
      if (module?.process?.active === false) return true;

      const response = await this.axios.post(
        "/start",
        {
          name: module.name,
          processId: module.id,
        },
        {
          timeout,
        }
      );
      if (response.status === 200) return true;
    } catch (e) {
      console.error(e);
      return false;
    }
    return false;
  };

  public stopProcesses = async (): Promise<boolean> => {
    await this.getProcessesStatus();
    return (
      await Promise.all(
        this.modules.map((module) => this.stopRobotProcess(module.id))
      )
    ).reduce((acc, val) => acc && val, true);
  };

  // increase timeout and add it in opt param
  public stopRobotProcess = async (id: string): Promise<boolean> => {
    try {
      const module = this.modules.find((m) => m.id === id);
      if (!module) throw new Error("Module not found");
      if (!module?.process?.active) return true;

      const response = await this.axios.post("/stop", {
        processId: module.id,
        flush: true,
      });
      if (response.status === 200) return true;
    } catch (e) {
      return false;
    }
    return false;
  };
}
