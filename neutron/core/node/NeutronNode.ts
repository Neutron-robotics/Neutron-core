import { ILiteEvent } from "../../utils/LiteEvent";
import XYPosition from "../utils/XYPosition";
import { INeutronInputHandle, INeutronOutputHandle } from "./NeutronHandle";

export interface INeutronNode<TInput, TOutput> {
  id: string;
  type: string;
  position: XYPosition;
  inputHandles: Record<string, INeutronInputHandle<TInput>>;
  outputHandles: Record<string, INeutronOutputHandle>;
  executionStage: ILiteEvent<IExecutionStageEvent>;
  processNode: () => Promise<void>;
}

export interface INeutronNodeInputParams<T> {
  data: T;
}

export interface NeutronNodeDB {
  id: string;
  type: string;
  position: XYPosition;
  width?: number;
  height?: number;
  isInput?: boolean;
}

export interface IExecutionStageEvent {
  event: NodeExecutionStage;
  nodeId: string;
  data?: any;
}

export enum NodeExecutionStage {
  BeforeProcess,
  Processing,
  Error,
  Processed,
  Skipped,
}
