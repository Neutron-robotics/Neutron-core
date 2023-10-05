import XYPosition from "../utils/XYPosition";
import {
  NeutronEdgeDB,
  NeutronInputHandle,
  NeutronOutputHandle,
} from "./NeutronHandle";
import { INeutronNode, NeutronNodeDB } from "./NeutronNode";
import NodeFactory from "./implementation/nodeFactory";

export interface INeutronGraphNode {
  inputNode: INeutronNode<any, any>;
  nodes: INeutronNode<any, any>[];
  findNode: (
    inputNode: INeutronNode<any, any>,
    target: string
  ) => INeutronNode<any, any> | undefined;
}

export interface INodeBuilder {
  id: string;
  type: string;
  position: XYPosition;
}

class NeutronNodeGraph implements INeutronGraphNode {
  public inputNode: INeutronNode<any, any>;
  public nodes: INeutronNode<any, any>[];

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this.inputNode = {} as any;
    this.nodes = [];
    this.buildGraph(nodes, edges);
  }

  public findNode<T, T2>(
    inputNode: INeutronNode<T, T2>,
    targetId: string
  ): INeutronNode<T, T2> | undefined {
    for (const [key, handle] of Object.entries(inputNode.outputHandles)) {
      for (const target of handle.targets) {
        if (target.node.id === targetId) return target.node;
        else {
          const node = this.findNode(target.node, targetId);
          if (node) return node;
        }
      }
    }
  }

  private async handleNodeProcessed(node: INeutronNode<any, any>) {
    const nodeOrder = this.topologicalSort();
    let counter = 0;

    while (nodeOrder.length !== 0 && counter < nodeOrder.length) {
      await nodeOrder[counter].processNode();
      counter++;
    }
  }

  private topologicalSort(): INeutronNode<any, any>[] {
    // Create a map to store incoming edges for each node.
    const incomingEdges: Record<string, number> = {};

    // Create a queue to store nodes with no incoming edges.
    const queue: INeutronNode<any, any>[] = [];

    // Initialize incoming edges map.
    this.nodes.forEach((node) => {
      incomingEdges[node.id] = 0;
    });

    // Count incoming edges for each node.
    this.nodes.forEach((node) => {
      incomingEdges[node.id] = Object.entries(node.inputHandles).length;
    });

    // Add nodes with no incoming edges to the queue.
    this.nodes.forEach((node) => {
      if (incomingEdges[node.id] === 0) {
        queue.push(node);
      }
    });

    const sortedNodes: INeutronNode<any, any>[] = [];
    // Perform topological sorting.
    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      sortedNodes.push(currentNode);

      // Update incoming edges for adjacent nodes.
      this.nodes.forEach((node) => {
        Object.entries(node.inputHandles).forEach(([key, handle]) => {
          if (node.inputHandles[key].node.id === currentNode.id) {
            incomingEdges[node.id]--;
            if (incomingEdges[node.id] === 0) {
              queue.push(this.getNodeById(node.id));
            }
          }
        });
      });
    }

    // Check for cycles (if not all nodes are included).
    if (sortedNodes.length !== this.nodes.length) {
      throw new Error("The graph contains cycles.");
    }

    return sortedNodes;
  }

  private getNodeById(id: string): INeutronNode<any, any> {
    return this.nodes.find((node) => node.id === id)!;
  }

  private buildGraph(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    const inputNode = nodes.find((e) => e.isInput);
    if (!inputNode) throw new Error("No input node");

    const nodeBuilder = {
      id: inputNode.id,
      type: inputNode.type,
      position: inputNode.position,
    };
    const inputNeutronNode = this.makeNode(nodeBuilder, nodes, edges);
    inputNeutronNode.inputHandles;
    this.inputNode = inputNeutronNode;
  }

  private makeNode(
    nodeBuilder: INodeBuilder,
    nodes: NeutronNodeDB[],
    edges: NeutronEdgeDB[],
    inputNode?: INeutronNode<any, any>
  ): INeutronNode<any, any> {
    const node = NodeFactory.createNode(nodeBuilder);
    if (!node) {
      throw new Error(`Type ${nodeBuilder.type} is not implemented`);
    }

    const outputEdges = edges.filter((e) => e.source === node.id);
    for (const edge of outputEdges) {
      const targets = nodes.filter((e) => e.id === edge.target);
      if (!targets.length)
        throw new Error(
          `The node ${edge.target} defined by edge ${edge.id} could not be found while building graph`
        );
      for (const target of targets) {
        const nodeBuilder = {
          id: target.id,
          type: target.type,
          position: target.position,
        };

        const targetNode =
          this.findNode(inputNode ?? node, nodeBuilder.id) ??
          this.makeNode(nodeBuilder, nodes, edges, inputNode ?? node);

        if (!node.outputHandles[edge.sourceHandle]) {
          node.outputHandles[edge.sourceHandle] = new NeutronOutputHandle(
            edge.id,
            edge.sourceHandle
          );
        }

        if (!targetNode.inputHandles[edge.targetHandle]) {
          targetNode.inputHandles[edge.targetHandle] =
            new NeutronInputHandle<any>(edge.id, edge.targetHandle, targetNode);
        }

        node.outputHandles[edge.sourceHandle].targets.push(
          targetNode.inputHandles[edge.targetHandle]
        );
      }
    }

    return node;
  }
}

// Tests idea:
//
// - should throw if no input node
// - Should define a max loop threshold, and throw in case of infinite loop

export default NeutronNodeGraph;
