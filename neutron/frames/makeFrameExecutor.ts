import { v4 } from "uuid";
import { IConnectionContext } from "../context/ConnectionContext";
import { IFrame, IFrameExecutor, IFrameResult } from "../interfaces/frames";

interface IFrameExecutorConfig {
  method: string;
  methodType: string;
}

interface IFrameExecutorPeriodConfig extends IFrameExecutorConfig {
  period: number;
}

export interface IRosFrameExecutorConfig extends IFrameExecutorConfig {
  format: string;
}

export interface IRosFrameExecutorPeriodConfig
  extends IFrameExecutorPeriodConfig {
  format: string;
}

export const makeFrameExecutor = (
  config: IFrameExecutorConfig,
  payload: any,
  opts?: {
    chainWith?: IFrame;
    loopCancellationToken?: string;
  }
): IFrameExecutor => ({
  id: v4(),
  ...config,
  payload,
  next: opts?.chainWith
    ? (response: IFrameResult) => {
        const nextFrameExecutor = opts.chainWith!.build(response.result);
        return nextFrameExecutor;
      }
    : undefined,
  loopCancellationToken: opts?.loopCancellationToken,
});
