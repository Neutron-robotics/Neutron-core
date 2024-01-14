import axios, { AxiosInstance } from "axios";
import { v4 } from "uuid";
import IRobotStatusMessage from "../frames/CoreProtocol/robotStatusMessage";
import { ICoreModule, IRobotStatus } from "../interfaces/core";
import {
  getRobotConnectionTypeFromString,
  IRobotConnectionConfiguration,
  IRobotConnectionInfo,
  IRobotModule,
  IRobotModuleDefinition,
  ConnectionContextType,
  RobotStatus,
} from "../interfaces/RobotConnection";

export class Core implements IRobotModule {
  public type: string;

  private connection: IRobotConnectionInfo;

  private axios: AxiosInstance;

  public readonly id: string = v4();

  public name: string;

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
      type: ConnectionContextType.Tcp,
    };
  }

  public getConnectionInfo = async (): Promise<void> => {
    const response = await this.axios.get("/robot/configuration");
    const data = response.data;
    const payload = data.robot;
    if (!payload) throw new Error("No robot configuration found");

    this.name = payload.name;
    this.status = payload.status;
    this.battery = payload.battery;
    this.type = payload.type;
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

  public getRobotStatus = async (): Promise<IRobotStatus> => {
    const start = Date.now();
    const response = await this.axios.get("/robot/status");
    const finish = Date.now();
    const data = response.data as IRobotStatusMessage;

    this.modules = this.modules.map((module: ICoreModule) => {
      const process = data.modules.find((p) => p.id === module.id);
      return {
        ...module,
        process: process,
      };
    });
    return {
      ...data,
      time: finish - start,
      modules: this.modules,
    };
  };

  public startProcesses = async (timeout?: number): Promise<boolean> => {
    await this.getRobotStatus();
    const res = (
      await Promise.all(
        this.modules.map((module) => this.startRobotProcess(module.id, timeout))
      )
    ).reduce((acc, val) => acc && val, true);
    await this.getRobotStatus();
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
      if (module?.process?.active === false) return false; // need to reboot ?

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
    await this.getRobotStatus();
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
