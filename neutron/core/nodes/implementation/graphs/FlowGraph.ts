import NeutronGraphError from '../../../errors/NeutronGraphError';
import NeutronNodeComputeError from '../../../errors/NeutronNodeError';
import BaseNode from '../../BaseNode';
import { NeutronEdgeDB, NeutronNodeDB, NodeMessage } from '../../INeutronNode';
import { IInputNode } from '../../InputNode';
import NeutronBaseGraph from '../../NeutronBaseGraph';
import NodeFactory, { inputNodesSet } from '../../NodeFactory';

/*
 * The flow graph can be composed of severals input node.
 * This graph can have circles and possibly run forever.
 */
class FlowGraph extends NeutronBaseGraph {
  private inputNodes: BaseNode[];

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    super(nodes, edges);
    this.inputNodes = [];
    this.buildGraph(edges);
    this.nodes.forEach(e => {
      e.BeforeProcessingEvent.on(proc => this.NodeProcessEvent.trigger({
        nodeId: proc.nodeId,
        status: 'running'
      }));
      e.AfterProcessingEvent.on(proc => this.NodeProcessEvent.trigger({
        nodeId: proc.nodeId,
        status: 'completed'
      }));

      if (e.isInput === true) {
        (e as unknown as IInputNode).ProcessingBegin.on(this.handleInputNodeProcessingBegin);
      }
    });
  }

  public async runAllNodes(
    message?: Record<string, NodeMessage>
  ): Promise<void> {
    this.shouldStop = false;
    await Promise.all(
      this.inputNodes.map(e => this.run(e, message ? message[e.id] : undefined))
    );
  }

  public async runInputNode(
    nodeId: string,
    message?: NodeMessage
  ): Promise<void> {
    const node = this.nodes.find(e => e.id === nodeId);
    if (!node) {
      throw new NeutronNodeComputeError(
        `Could not find node ${nodeId} in graph`
      );
    }

    if (!node.isInput) throw new NeutronNodeComputeError(`Node ${nodeId} is not an input`);

    this.shouldStop = false;
    return await this.run(node, message);
  }

  public async run(node: BaseNode, message?: NodeMessage): Promise<void> {
    if (this.shouldStop) return;
    const output = await node.processNode(message ?? { payload: {} });

    const nextNodes = Object.entries(node.nextNodes)
      .filter(([handle, nodes]) => output?.outputHandles?.includes(handle))
      .reduce<BaseNode[]>((acc, [handle, nodes]) => [...acc, ...nodes], []);

    const nextNodesPromises = nextNodes.map(nextNode => this.run(nextNode, output));
    await Promise.all(nextNodesPromises);
  }

  private buildGraph(edges: NeutronEdgeDB[]): void {
    this.nodes.forEach(node => {
      const nextEdges = edges.filter(e => e.source === node.id);
      nextEdges.forEach(edge => {
        const nextNode = this.nodes.find(e => e.id === edge.target);
        if (!nextNode) {
          throw new NeutronGraphError(
            `No node with id ${edge.target} has been provided`
          );
        }
        node.nextNodes[edge.sourceHandle]
          ? node.nextNodes[edge.sourceHandle].push(nextNode)
          : (node.nextNodes[edge.sourceHandle] = [nextNode]);
      });
    });
  }
}

export default FlowGraph;
