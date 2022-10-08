import { IFrameExecutor, IFrameResult } from "../interfaces/frames";
import { LiteEventHandler } from "../utils/LiteEvent";

interface IConnectionContextConfiguration {
  host: string;
  port: number;
}

interface IConnectionContext {
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  isConnected: boolean;
  hostname: string;
  port: number;

  request(frame: IFrameExecutor): Promise<IFrameResult>;
  send(frame: IFrameExecutor): Promise<IFrameResult>;
  sendLoop(frame: IFrameExecutor): Promise<IFrameResult>;
  on<T>(executor: IFrameExecutor, handler: LiteEventHandler<T>): void;
  off<T>(executor: IFrameExecutor, handler: LiteEventHandler<T>): void;
  execute(executor: IFrameExecutor): Promise<IFrameResult>;
}

abstract class ConnectionContext implements IConnectionContext {
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

  public abstract request(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract send(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract sendLoop(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract on<T>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract off<T>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract removeAllListeners(): void;

  public abstract execute(executor: IFrameExecutor): Promise<IFrameResult>;
}

export { ConnectionContext, IConnectionContext };
