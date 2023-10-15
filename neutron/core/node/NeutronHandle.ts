import { ILiteEvent, LiteEvent } from "../../utils/LiteEvent";
import { INeutronNode } from "./NeutronNode";

export interface INeutronHandle {
  id: string;
  propertyName: string;
  type: "input" | "output";
}

export interface INeutronInputHandle<TData> extends INeutronHandle {
  type: "input";
  node: INeutronNode<any, any>;
  value?: HandleNodeValue<TData>;
}

export interface INeutronOutputHandle extends INeutronHandle {
  type: "output";
  targets: INeutronInputHandle<any>[];
  cleanValues: () => void;
}

export interface NeutronEdgeDB {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  id: string;
}

export interface HandleNodeValue<T> {
  data: T;
  isSkipped?: boolean;
}

export class NeutronInputHandle<T> implements INeutronInputHandle<T> {
  public readonly id: string;
  public readonly type = "input";
  public node: INeutronNode<any, any>;
  public value?: HandleNodeValue<T>;
  public propertyName: string;

  constructor(id: string, propertyName: string, node: INeutronNode<any, any>) {
    this.id = id;
    this.propertyName = propertyName;
    this.node = node;
  }
}

export class NeutronOutputHandle implements INeutronOutputHandle {
  public readonly id: string;
  public readonly type = "output";
  public targets: NeutronInputHandle<any>[];
  public propertyName: string;

  constructor(id: string, propertyName: string) {
    this.id = id;
    this.propertyName = propertyName;
    this.targets = [];
  }

  public setValue(value: HandleNodeValue<any>) {
    if (!value) return;

    for (const target of this.targets) {
      if (target.value?.data && value.isSkipped) {
      } else target.value = value;
    }
  }

  public cleanValues() {
    for (const target of this.targets) {
      target.value = undefined;
    }
  }
}
