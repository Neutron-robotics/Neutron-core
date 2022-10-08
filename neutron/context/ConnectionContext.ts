import { IFrameExecutor } from "../interfaces/frames";
import { LiteEventHandler } from "../utils/LiteEvent";

interface IConnectionContextConfiguration {
  host: string;
  port: number;
}

abstract class ConnectionContext {
  public type: string;

  public hostname: string;

  public port: number;

  constructor(type: string, config: IConnectionContextConfiguration) {
    this.type = type;
    this.hostname = config.host;
    this.port = config.port;
  }

  public abstract get isConnected(): boolean;

  public abstract connect(): Promise<boolean>;

  public abstract disconnect(): Promise<boolean>;

  public abstract request(executor: IFrameExecutor): Promise<any>;

  public abstract send(executor: IFrameExecutor): Promise<any>;

  public abstract sendLoop(executor: IFrameExecutor): Promise<any>;

  public abstract on<T>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract off<T>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract removeAllListeners(): void;

  public abstract execute(executor: IFrameExecutor): Promise<any>;
}

export { ConnectionContext };
