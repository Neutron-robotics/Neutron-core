import { IFrameExecutor } from "../interfaces/frames";

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

    public abstract connect(): Promise<boolean>;

    public abstract disconnect(): Promise<boolean>;

    public abstract request(executor: IFrameExecutor): Promise<any>

    public abstract send(executor: IFrameExecutor): Promise<any>

    public abstract sendLoop(executor: IFrameExecutor): Promise<any>

    public abstract subscribe(executor: IFrameExecutor): Promise<any>

    public abstract execute(executor: IFrameExecutor): Promise<any>
}

export {
    ConnectionContext,
}