import { IConnectionContext } from "../../context/ConnectionContext";
import { RosContext } from "../../context/RosContext";
import { ILiteEvent, LiteEvent } from "../../utils/LiteEvent";
import NeutronGraphError from "../errors/NeutronGraphError";
import BaseNode from "./BaseNode";
import { IBaseNodeEvent, INodeBuilder, NeutronEdgeDB, NeutronNodeDB, NodeMessage } from "./INeutronNode";
import { IInputNode } from "./InputNode";
import NodeFactory from "./NodeFactory";
import { RosNode } from "./implementation/nodes";

export type NeutronGraphType = "Flow" | "Connector";

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

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this.NodeProcessEvent = new LiteEvent<INeutronGraphProcessEvent>();
    this.edges = edges;
    this.nodes = nodes.map((node) => NodeFactory.createNode(node));
    this.environment = {};
    this.shouldStop = false;
  }

  public abstract run(node: BaseNode, message?: NodeMessage): Promise<void>

  public getNodeById<TNode extends BaseNode>(id: string): TNode | undefined {
    const node = this.nodes.find((node) => node.id === id);

    if (node) return node as TNode;
  }

  public stopExecution(): void {
    this.shouldStop = true;
  }


  public findNodeByType<TNode extends BaseNode>(nodeType: {
    new (builder: INodeBuilder<any>): TNode;
  }): TNode[] {
    return this.nodes.filter((e) => e instanceof nodeType) as TNode[];
  }

  public getInputNodes(): IInputNode[]  {
    return this.nodes.filter(e => e.isInput === true) as unknown as IInputNode[]
  }  

  public useContext(context: IConnectionContext) {
    if (context.constructor.name === 'RosContext')
      this.nodes.forEach((e) => {
        if ((e as RosNode).useRosContext)
        (e as RosNode).useRosContext(context as RosContext)
    })
  }

  protected handleInputNodeProcessingBegin = async (event: IBaseNodeEvent) => {
    const {nodeId, data} = event

    const node = this.getNodeById(nodeId)
    if (!node)
      throw new NeutronGraphError(`failed to handleInputNodeProcessingBegin event: no node with id ${nodeId} found`)

    const message: NodeMessage = {
        payload: data
    }
    await this.run(node, message);

    (node as unknown as IInputNode).ProcessingFinished.trigger(node.id)
  }
}

export default NeutronBaseGraph;
