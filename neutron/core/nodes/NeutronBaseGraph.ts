import { ILiteEvent, LiteEvent } from "../../utils/LiteEvent";
import BaseNode from "./BaseNode";
import { NeutronEdgeDB, NeutronNodeDB } from "./INeutronNode";
import NodeFactory from "./NodeFactory";

abstract class NeutronBaseGraph {
  public NodeProcessEvent: ILiteEvent<string>;
  protected nodes: BaseNode[];
  protected edges: NeutronEdgeDB[];
  protected environment: Record<string, any>;

  public get nodeCount(): number {
    return this.nodes.length;
  }

  public getNodeById<TNode extends BaseNode>(id: string): TNode | undefined {
    const node = this.nodes.find((node) => node.id === id);

    if (node) return node as TNode;
  }

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this.NodeProcessEvent = new LiteEvent<string>();
    this.edges = edges;
    this.nodes = nodes.map((node) => NodeFactory.createNode(node));
    this.environment = {};
  }
}

export default NeutronBaseGraph;
