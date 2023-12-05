import NeutronGraphError from "../../../errors/NeutronGraphError";
import BaseNode from "../../BaseNode";
import { NeutronEdgeDB, NeutronNodeDB, NodeMessage } from "../../INeutronNode";
import NeutronBaseGraph from "../../NeutronBaseGraph";
import NodeFactory, { inputNodesSet } from "../../NodeFactory";

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
    this.nodes.forEach((e) =>
      e.AfterProcessingEvent.on((e) => this.NodeProcessEvent.trigger(e.nodeId))
    );
  }

  public async runInputNode(message?: NodeMessage): Promise<void> {
    await this.run(this.inputNode, message);
  }

  public async run(node: BaseNode, message?: NodeMessage): Promise<void> {
    const output = await node.processNode(message ?? { payload: {} });

    const nextNodes = Object.entries(node.nextNodes)
      .filter(([handle, nodes]) => output?.outputHandles?.includes(handle))
      .reduce<BaseNode[]>((acc, [handle, nodes]) => [...acc, ...nodes], []);

    const nextNodesPromises = nextNodes.map((nextNode) => this.run(nextNode));
    await Promise.all(nextNodesPromises);
  }

  private buildGraph(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]): BaseNode {
    const inputNode = nodes.find((e) => inputNodesSet.has(e.data.name));
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
