import { ILiteEvent, LiteEvent } from "../../utils/LiteEvent";
import BaseNode from "./BaseNode";
import { INodeBuilder, NeutronEdgeDB, NeutronNodeDB } from "./INeutronNode";
import NodeFactory from "./NodeFactory";

export type NeutronGraphType = "Flow" | "Connector" | "Component";

export interface INeutronGraphProcessEvent {
  nodeId: string;
  status: "running" | "completed";
}

abstract class NeutronBaseGraph {
  public NodeProcessEvent: ILiteEvent<INeutronGraphProcessEvent>;
  protected nodes: BaseNode[];
  protected edges: NeutronEdgeDB[];
  protected environment: Record<string, any>;
  protected shouldStop: boolean;

  public get nodeCount(): number {
    return this.nodes.length;
  }

  public getNodeById<TNode extends BaseNode>(id: string): TNode | undefined {
    const node = this.nodes.find((node) => node.id === id);

    if (node) return node as TNode;
  }

  public stopExecution(): void {
    this.shouldStop = true;
  }

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this.NodeProcessEvent = new LiteEvent<INeutronGraphProcessEvent>();
    this.edges = edges;
    this.nodes = nodes.map((node) => NodeFactory.createNode(node));
    this.environment = {};
    this.shouldStop = false;
  }

  public findNodeByType<TNode extends BaseNode>(nodeType: {
    new (builder: INodeBuilder<any>): TNode;
  }): TNode[] {
    return this.nodes.filter((e) => e instanceof nodeType) as TNode[];
  }
}

export default NeutronBaseGraph;
