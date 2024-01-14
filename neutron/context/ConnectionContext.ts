import { IFrameExecutor, IFrameResult } from "../interfaces/frames";
import { ConnectionContextType } from "../interfaces/RobotConnection";
import { LiteEventHandler } from "../utils/LiteEvent";

interface IConnectionContextConfiguration {
  hostname: string;
  port: number;
}

interface IConnectionContext {
  type: ConnectionContextType;

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
  // execute(executor: IFrameExecutor): Promise<IFrameResult>;
}

abstract class ConnectionContext implements IConnectionContext {
  public type: ConnectionContextType;

  public hostname: string;

  public port: number;

  constructor(
    type: ConnectionContextType,
    config: IConnectionContextConfiguration
  ) {
    this.type = type;
    this.hostname = config.hostname;
    this.port = config.port;
    this.loopHandlers = new Map<string, LiteEventHandler<void>>();
  }

  protected loopHandlers: Map<string, LiteEventHandler<void>>;

  public abstract get isConnected(): boolean;

  public abstract connect(): Promise<boolean>;

  public abstract disconnect(): Promise<boolean>;

  public abstract request(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract send(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract sendLoop(executor: IFrameExecutor): Promise<IFrameResult>;

  public abstract on<T extends any>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract off<T>(
    executor: IFrameExecutor,
    handler: LiteEventHandler<T>
  ): void;

  public abstract removeAllListeners(): void;

  protected abstract stopLoop(cancellationToken: string): void;
}

export {
  ConnectionContext,
  IConnectionContext,
  IConnectionContextConfiguration,
};
