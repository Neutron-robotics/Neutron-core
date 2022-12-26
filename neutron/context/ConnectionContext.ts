import { IFrameExecutor, IFrameResult } from "../interfaces/frames";
import { RobotConnectionType } from "../interfaces/RobotConnection";
import { LiteEventHandler } from "../utils/LiteEvent";

interface IConnectionContextConfiguration {
  hostname: string;
  port: number;
}

interface IConnectionContext {
  type: RobotConnectionType;

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
  public type: RobotConnectionType;

  public hostname: string;

  public port: number;

  constructor(
    type: RobotConnectionType,
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

  public async execute(executor: IFrameExecutor): Promise<IFrameResult> {
    let result = null;

    if (executor.loopCancellationToken)
      this.stopLoop(executor.loopCancellationToken);

    switch (executor.method) {
      case "request":
        result = await this.request(executor);
        break;
      case "send":
        console.log("send ", executor)
        result = await this.send(executor);
        break;
      case "sendLoop":
        result = await this.sendLoop(executor);
        break;
      default:
        return Promise.reject("Unknown executor type");
    }
    if (executor.next) {
      const nextExecutor = executor.next(result);
      const nextResult = await this.execute(nextExecutor);
      return {
        ...result,
        next: nextResult,
      };
    }
    return result;
  }

  protected abstract stopLoop(cancellationToken: string): void;
}

export {
  ConnectionContext,
  IConnectionContext,
  IConnectionContextConfiguration,
};
