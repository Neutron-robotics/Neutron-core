import { IConnectionContext } from "../context/ConnectionContext";
import { ILiteEvent } from "../utils/LiteEvent";

interface IFrame {
  id: string;
  name: string;
  build(body: any): IFrameExecutor;
}

interface IFramePackage {
  id: string;
  name: string;
  frames: IFrame[];
}

interface IFrameExecutor {
  methodType: string;
  payload: any;
  next?: (response: IFrameResult) => IFrameExecutor;
  loopCancellationToken?: string;
}

interface IRosFrameExecutor extends IFrameExecutor {
  format: string;
}

interface IFrameExecutorPeriodic extends IFrameExecutor {
  period: number;
}

interface IRosFrameExecutorPeriodic extends IRosFrameExecutor {
  period: number;
}

interface IFrameResult {
  success: boolean;
  result: any;
  next?: IFrameResult;
}

interface IFrameResultLoop extends IFrameResult {
  event: ILiteEvent<IFrameResult>;
  stop(): void;
}

export {
  IFrame,
  IFrameExecutor,
  IFramePackage,
  IFrameExecutorPeriodic,
  IRosFrameExecutorPeriodic,
  IRosFrameExecutor,
  IFrameResult,
  IFrameResultLoop,
};
