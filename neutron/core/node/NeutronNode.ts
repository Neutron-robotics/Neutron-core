import XYPosition from "../utils/XYPosition";
import { INeutronInputHandle, INeutronOutputHandle } from "./NeutronHandle";

export interface INeutronNode {
  id: string;
  type: string;
  position: XYPosition;
  inputHandles: INeutronInputHandle[];
  outputHandles: INeutronOutputHandle[];
  process: (data: any) => any;
}

export interface NeutronNodeDB {
  id: string;
  type: string;
  position: XYPosition;
  width?: number;
  height?: number;
  input?: boolean;
}
