import XYPosition from "../utils/XYPosition";
import {
  NeutronEdgeDB,
  NeutronInputHandle,
  NeutronOutputHandle,
} from "./NeutronHandle";
import {
  IExecutionStageEvent,
  INeutronNode,
  NeutronNodeDB,
  NodeExecutionStage,
} from "./NeutronNode";
import NodeFactory from "./implementation/nodeFactory";

export interface INeutronGraphNode {
  inputNode: INeutronNode<any, any>;
  nodes: INeutronNode<any, any>[];
  getNode: <T extends INeutronNode<any, any>>(id: string) => T | undefined;
}

export interface INodeBuilder {
  id: string;
  type: string;
  position: XYPosition;
}

interface IGraphTopologicalSort {
  incomingHandles: Record<string, Set<string>>;
  queue: INeutronNode<any, any>[];
  processed: string[];
}

class NeutronNodeGraph implements INeutronGraphNode {
  public inputNode: INeutronNode<any, any>;
  public nodes: INeutronNode<any, any>[];

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this.inputNode = {} as any;
    this.nodes = [];
    this.buildGraph(nodes, edges);
    this.inputNode.executionStage.on((e) => {
      switch (e.event) {
        case NodeExecutionStage.Processed:
          this.handleInputNodeProcessed();
          break;
        default:
          break;
      }
    });
  }

  public getNode<T extends INeutronNode<any, any>>(id: string): T | undefined {
    return this.nodes.find((node) => node.id === id) as T | undefined;
  }

  private findNodeInGraph<T, T2>(
    inputNode: INeutronNode<T, T2>,
    targetId: string
  ): INeutronNode<T, T2> | undefined {
    for (const [key, handle] of Object.entries(inputNode.outputHandles)) {
      for (const target of handle.targets) {
        if (target.node.id === targetId) return target.node;
        else {
          const node = this.findNodeInGraph(target.node, targetId);
          if (node) return node;
        }
      }
    }
  }

  private handleInputNodeProcessed = () => {
    console.log("Input node processed");
    // const sort = this.getTopologicalSort();
    const incomingHandles: Record<string, Set<string>> = {};
    const queue: INeutronNode<any, any>[] = [];
    const processed: string[] = [];

    const processNodeBatch = () => {
      console.log("Process Batch");
      while (queue.length > 0) {
        const nodeToProcess = queue.shift();
        nodeToProcess?.processNode();
      }
    };

    const handleNodeProcedeed = (e: IExecutionStageEvent) => {
      if (
        e.event !== NodeExecutionStage.Processed &&
        e.event !== NodeExecutionStage.Skipped
      )
        return;

      processed.push(e.nodeId);

      const processedNode = this.nodes.find((n) => n.id === e.nodeId);
      console.log(
        `[${processedNode?.id}][${
          (processedNode as any).constructor.name
        }] - Processed`
      );
      if (!processedNode) throw new Error("Processed node do not exist");

      // Resolve input property for each node that are connected with
      // the processed node. If the node has all input completed,
      // it is added to the queue
      Object.entries(processedNode.outputHandles).forEach(([key, handle]) => {
        handle.targets.forEach((inputHandle) => {
          incomingHandles[inputHandle.node.id].delete(inputHandle.propertyName);
          if (incomingHandles[inputHandle.node.id].size === 0) {
            queue.push(inputHandle.node);
            console.log(
              `[${processedNode?.id}][${
                (processedNode as any).constructor.name
              }] - Add ${inputHandle.node.id} (${
                (inputHandle.node as any).constructor.name
              }) to the next batch`
            );
          }
        });
      });

      processNodeBatch();
    };

    this.nodes.forEach((node) => {
      incomingHandles[node.id] = new Set();
      node.executionStage.on(handleNodeProcedeed);
    });

    this.nodes.forEach((node) => {
      Object.values(node.inputHandles).forEach((handle) => {
        incomingHandles[node.id].add(handle.propertyName);
      });
    });

    handleNodeProcedeed({
      nodeId: this.inputNode.id,
      event: NodeExecutionStage.Processed,
    });
  };

  private getTopologicalSort(): IGraphTopologicalSort {
    // Create a map to store incoming edges for each node.
    const incomingHandles: Record<string, Set<string>> = {};
    const queue: INeutronNode<any, any>[] = [];
    const processed: string[] = [];

    // Initialize incoming edges map.
    this.nodes.forEach((node) => {
      incomingHandles[node.id] = new Set();
    });

    // Count incoming edges for each node.
    this.nodes.forEach((node) => {
      Object.values(node.inputHandles).forEach((handle) => {
        incomingHandles[node.id].add(handle.propertyName);
      });
    });

    // Add nodes with no incoming edges to the queue.
    this.nodes.forEach((node) => {
      if (incomingHandles[node.id].size === 0) {
        queue.push(node);
      }
    });

    return {
      incomingHandles,
      queue,
      processed,
    };
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

    this.nodes.push(node);

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
          this.findNodeInGraph(inputNode ?? node, nodeBuilder.id) ??
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
