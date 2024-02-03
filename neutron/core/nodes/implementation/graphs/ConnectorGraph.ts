import NeutronGraphError from "../../../errors/NeutronGraphError";
import NeutronNodeComputeError from "../../../errors/NeutronNodeError";
import BaseNode from "../../BaseNode";
import { NeutronEdgeDB, NeutronNodeDB, NodeMessage } from "../../INeutronNode";
import { IInputNode } from "../../InputNode";
import NeutronBaseGraph from "../../NeutronBaseGraph";
import NodeFactory, { inputNodesSet } from "../../NodeFactory";
import { ControllerNode } from "../nodes";

/*
 * The connector graph has a single input node.
 * This graph is unidirectional.
 */
class ConnectorGraph extends NeutronBaseGraph {
  private inputNode: BaseNode;

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    super(nodes, edges);
    this.nodes = [];
    this.inputNode = this.buildGraph(nodes, edges);
    this.nodes.forEach((e) => {
      e.BeforeProcessingEvent.on((proc) =>
        this.NodeProcessEvent.trigger({
          nodeId: proc.nodeId,
          status: "running",
        })
      );
      e.AfterProcessingEvent.on((proc) =>
        this.NodeProcessEvent.trigger({
          nodeId: proc.nodeId,
          status: "completed",
        })
      );

      if (e.isInput === true) {
        (e as unknown as IInputNode).ProcessingBegin.on(this.handleInputNodeProcessingBegin)
      }
    });
  }

  public async runInputNode(
    nodeId?: string,
    message?: NodeMessage
  ): Promise<void> {
    this.shouldStop = false;
    if (nodeId !== undefined && nodeId !== this.inputNode.id)
      throw new NeutronNodeComputeError(`Node ${nodeId} is not the input`);

    await this.run(this.inputNode, message);
  }

  public async runAllNodes(
    message?: Record<string, NodeMessage>
  ): Promise<void> {
    if (!message) return;

    this.shouldStop = false;
    await this.run(this.inputNode, message[this.inputNode.id]);
  }

  public async run(node: BaseNode, message?: NodeMessage): Promise<void> {
    if (this.shouldStop) return;

    const output = await node.processNode(message ?? { payload: {} });

    const nextNodes = Object.entries(node.nextNodes)
      .filter(([handle, nodes]) => output?.outputHandles?.includes(handle))
      .reduce<BaseNode[]>((acc, [handle, nodes]) => [...acc, ...nodes], []);

    const nextNodesPromises = nextNodes.map((nextNode) =>
      this.run(nextNode, output)
    );
    await Promise.all(nextNodesPromises);
  }

  public getControllerNodes(): ControllerNode<any>[] {
    return (this.nodes as ControllerNode<any>[])
      .filter(node => node.isControllerNode)
  } 

  private buildGraph(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]): BaseNode {
    const inputNode = nodes.find((e) => inputNodesSet.has(e.data.name.toLowerCase().replaceAll(' ', '')));
    if (!inputNode)
      throw new NeutronGraphError("No input node has been provided");

    const inputNeutronNode = this.makeNode(inputNode, nodes, edges);
    return inputNeutronNode;
  }

  private makeNode(
    nodeBuilder: NeutronNodeDB,
    nodes: NeutronNodeDB[],
    edges: NeutronEdgeDB[],
    visited: Set<string> = new Set(),
    inputNode?: BaseNode
  ): BaseNode {
    const node = NodeFactory.createNode(nodeBuilder);
    if (!node) {
      throw new NeutronGraphError(
        `Type ${nodeBuilder.data.name} is not implemented`
      );
    }

    if (visited.has(node.id))
      throw new NeutronGraphError(
        "A cycle has been detected while building the graph"
      );

    this.nodes.push(node);
    visited.add(node.id);

    const nextEdges = edges.filter((e) => e.source === node.id);
    for (const nextEdge of nextEdges) {
      const nextNodeBuilder = nodes.find((n) => nextEdge.target === n.id);
      if (!nextNodeBuilder) {
        throw new NeutronGraphError(
          `No node with id ${nextEdge.target} has been provided`
        );
      }
      const nextNode = this.makeNode(
        nextNodeBuilder,
        nodes,
        edges,
        visited,
        inputNode ?? node
      );
      if (
        node.nextNodes[nextEdge.sourceHandle]?.find((e) => e.id === nextNode.id)
      ) {
        throw new NeutronGraphError(
          `The next node ${nextNode.id} is already connected to the node ${node.id}`
        );
      }

      node.nextNodes[nextEdge.sourceHandle]
        ? node.nextNodes[nextEdge.sourceHandle].push(nextNode)
        : (node.nextNodes[nextEdge.sourceHandle] = [nextNode]);
    }
    return node;
  }
}

export default ConnectorGraph;
