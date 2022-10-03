import { ServiceResponse } from "roslib";
import { RosContext } from "../context/RosContext";

export interface ICameraConfiguration {
  ip: string;
}

export class Camera {
  public isConnected: boolean;

  public id: string;

  public name: string;

  public configuration: ICameraConfiguration;

  private context: RosContext;

  constructor(
    id: string,
    name: string,
    configuration: ICameraConfiguration,
    context: RosContext
  ) {
    this.id = id;
    this.name = name;
    this.isConnected = false;
    this.configuration = configuration;
    this.context = context;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleConnectSuccess = () => {
        this.isConnected = true;
        resolve();
      };
      const handleConnectFailure = (res: ServiceResponse) => {
        this.isConnected = false;
        console.log(res);
        reject(res);
      };
      this.context.callService(
        "/start_camera",
        "myrobotics_protocol/srv/GlobalResult",
        {},
        handleConnectSuccess,
        handleConnectFailure
      );
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleDisconnectSuccess = () => {
        this.isConnected = false;
        resolve();
      };
      const handleDisconnectFailure = (res: ServiceResponse) => {
        this.isConnected = true;
        console.log(res);
        reject(res);
      };
      this.context.callService(
        "/stop_camera",
        "myrobotics_protocol/srv/GlobalResult",
        {},
        handleDisconnectSuccess,
        handleDisconnectFailure
      );
    });
  }
}
