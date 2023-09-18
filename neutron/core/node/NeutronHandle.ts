import { INeutronNode } from "./NeutronNode";

export interface INeutronHandle {
  id: string;
  node: INeutronNode;
  type: "input" | "output";
}

export interface INeutronInputHandle extends INeutronHandle {
  type: "input";
  //   source: INeutronOutputHandle | undefined;
}

export interface INeutronOutputHandle extends INeutronHandle {
  type: "output";
  //   target: INeutronInputHandle | undefined;
}

export interface NeutronEdgeDB {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  id: string;
}
