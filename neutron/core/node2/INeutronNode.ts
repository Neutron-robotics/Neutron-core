import { RosContext } from "../../context/RosContext";
import { IRos2System } from "../../models/ros2/ros2";
import { ILiteEvent } from "../../utils/LiteEvent";
import XYPosition from "../utils/XYPosition";

export interface NodeMessage {
  payload: any;
}

export type NeutronPrimitiveType =
  | "string"
  | "number"
  | "bool"
  | "json"
  | "env"
  | "msg";

export interface INeutronNode {
  id: string;
  type: string;
  position: XYPosition;
  isInput: boolean;
  BeforeProcessingEvent: ILiteEvent<IBaseNodeEvent>;
  AfterProcessingEvent: ILiteEvent<IBaseNodeEvent>;
  ProcessingErrorEvent: ILiteEvent<IBaseNodeEvent>;
  processNode(input: NodeMessage): Promise<NodeMessage | undefined>;
}

export interface INodeBuilder<T> {
  id: string;
  type: string;
  position: XYPosition;
  specifics: T;
}

export interface IRosNode {
  useRos: (context: RosContext, system: IRos2System) => void;
  isConnected: boolean;
}

export interface IBaseNodeEvent {
  nodeId: string;
  data: any;
}

export interface NodeMessage {
  payload: any;
}

export interface OutputNodeMessage {
  payload: any;
  outputHandles?: string[];
}
