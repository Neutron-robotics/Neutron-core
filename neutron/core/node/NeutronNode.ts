import { ILiteEvent } from "../../utils/LiteEvent";
import XYPosition from "../utils/XYPosition";
import { INeutronInputHandle, INeutronOutputHandle } from "./NeutronHandle";

export interface INeutronNode<TInput, TOutput> {
  id: string;
  type: string;
  position: XYPosition;
  inputHandles: Record<string, INeutronInputHandle<TInput>>;
  outputHandles: Record<string, INeutronOutputHandle>;
  BeforeProcessingEvent: ILiteEvent<IExecutionStageProcessingEvent<TInput>>;
  AfterProcessingEvent: ILiteEvent<
    IExecutionStageProcessingEvent<Partial<TOutput>>
  >;
  ProcessingErrorEvent: ILiteEvent<IExecutionStageEvent>;
  SkippedNodeEvent: ILiteEvent<IExecutionStageEvent>;
  processNode: () => Promise<void>;
}

export interface INeutronNodeInputParams<T> {
  data: T;
}

export interface NeutronNodeData {
  color: string;
  name: string;
  inputHandles: number;
  outputHandles: number;
  specifics: any;
}

export interface NeutronNodeDB {
  id: string;
  position: XYPosition;
  width?: number;
  height?: number;
  data: NeutronNodeData;
}

export interface IExecutionStageEvent {
  nodeId: string;
}

export interface IExecutionStageProcessingEvent<T>
  extends IExecutionStageEvent {
  data: Partial<T>;
}

export enum NodeExecutionStage {
  BeforeProcess,
  Processing,
  Error,
  Processed,
  Skipped,
}
