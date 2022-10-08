import { ILiteEvent } from "../utils/LiteEvent";

interface IFrame {
  id: string;
  name: string;
  build(body: any): IFrameExecutor;
  callBackFrames?: string[];
}

interface IFramePackage {
  id: string;
  name: string;
  frames: IFrame[];
}

interface IFrameExecutor {
  id: string;
  methodType: string;
  method: string;
  payload: any;
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
