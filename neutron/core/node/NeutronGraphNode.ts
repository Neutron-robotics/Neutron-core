import { ILiteEvent, LiteEvent } from "../../../dist";
import NeutronGraphError from "../errors/NeutronGraphError";
import XYPosition from "../utils/XYPosition";
import {
  NeutronEdgeDB,
  NeutronInputHandle,
  NeutronOutputHandle,
} from "./NeutronHandle";
import {
  IExecutionStageEvent,
  IExecutionStageProcessingEvent,
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

class NeutronNodeGraph implements INeutronGraphNode {
  public inputNode: INeutronNode<any, any>;
  public nodes: INeutronNode<any, any>[];

  private _nodeDb: NeutronNodeDB[];
  private _edgesDb: NeutronEdgeDB[];
  private _cleanupFn: (() => void)[];
  private _processingAction: ILiteEvent<boolean>;

  constructor(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    this._nodeDb = nodes;
    this._edgesDb = edges;
    this.inputNode = {} as any;
    this.nodes = [];
    this.buildGraph(nodes, edges);
    this.inputNode.AfterProcessingEvent.on(this.handleInputNodeProcessed);
    this._cleanupFn = [];
    this._processingAction = new LiteEvent<boolean>();
    this._processingAction.on((value) => {
      if (!value) this.cleanGraph();
    });
  }

  public waitToProcess(): Promise<void> {
    return new Promise((res) => {
      const processed = (e: boolean) => {
        if (!e) {
          this._processingAction.off(processed);
          res();
        }
      };
      this._processingAction.on(processed);
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
    const incomingHandles: Record<string, Record<string, number>> = {};
    const queue: INeutronNode<any, any>[] = [];
    const processed: string[] = [];
    const processing: Set<string> = new Set<string>();

    const processNodeBatch = () => {
      console.log("Process Batch");

      if (queue.length === 0 && processing.size === 0) {
        console.log("End processing graph ?");
        this._processingAction.trigger(false);
      }

      while (queue.length > 0) {
        const nodeToProcess = queue.shift();
        if (!nodeToProcess) return;

        processing.add(nodeToProcess.id);
        nodeToProcess.processNode();
      }
    };

    const handleNodeProcedeed = (
      e: IExecutionStageEvent | IExecutionStageProcessingEvent<any>
    ) => {
      processed.push(e.nodeId);

      const processedNode = this.nodes.find((n) => n.id === e.nodeId);
      console.log(
        `[${processedNode?.id}][${
          (processedNode as any).constructor.name
        }] - Processed`
      );
      if (!processedNode) throw new Error("Processed node do not exist");
      processing.delete(processedNode.id);
      // Resolve input property for each node that are connected with
      // the processed node. If the node has all input completed,
      // it is added to the queue
      Object.entries(processedNode.outputHandles).forEach(([key, handle]) => {
        handle.targets.forEach((inputHandle) => {
          // incomingHandles[inputHandle.node.id].delete(inputHandle.propertyName);
          incomingHandles[inputHandle.node.id][inputHandle.propertyName]--;
          if (
            Object.values(incomingHandles[inputHandle.node.id]).every(
              (e) => e === 0
            ) &&
            !processing.has(inputHandle.node.id)
          ) {
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
      incomingHandles[node.id] = {};
      Object.values(node.inputHandles).forEach((handle) => {
        const inputNb = this._edgesDb.filter(
          (e) => e.target === node.id && e.targetHandle === handle.propertyName
        ).length;

        incomingHandles[node.id][handle.propertyName] = inputNb;
      });

      if (node.id !== this.inputNode.id) {
        node.AfterProcessingEvent.on(handleNodeProcedeed);
        node.SkippedNodeEvent.on(handleNodeProcedeed);
        this._cleanupFn.push(() => {
          node.AfterProcessingEvent.off(handleNodeProcedeed);
          node.SkippedNodeEvent.off(handleNodeProcedeed);
        });
      }
    });

    this._processingAction.trigger(true);
    handleNodeProcedeed({
      nodeId: this.inputNode.id,
    });
  };

  private buildGraph(nodes: NeutronNodeDB[], edges: NeutronEdgeDB[]) {
    const inputNode = nodes.find((e) => e.isInput);
    if (!inputNode)
      throw new NeutronGraphError("No input node has been provided");

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
    visited: Set<string> = new Set(),
    inputNode?: INeutronNode<any, any>
  ): INeutronNode<any, any> {
    const node = NodeFactory.createNode(nodeBuilder);
    if (!node) {
      throw new NeutronGraphError(
        `Type ${nodeBuilder.type} is not implemented`
      );
    }

    if (visited.has(node.id))
      throw new NeutronGraphError(
        "A cycle has been detected while building the graph"
      );

    this.nodes.push(node);
    visited.add(node.id);

    const outputEdges = edges.filter((e) => e.source === node.id);
    for (const edge of outputEdges) {
      const targets = nodes.filter((e) => e.id === edge.target);
      if (!targets.length)
        throw new NeutronGraphError(
          `The node ${edge.target} defined by edge ${edge.id} could not be found while building graph`,
          node.id
        );
      for (const target of targets) {
        const nodeBuilder = {
          id: target.id,
          type: target.type,
          position: target.position,
        };

        const targetNode =
          this.findNodeInGraph(inputNode ?? node, nodeBuilder.id) ??
          this.makeNode(nodeBuilder, nodes, edges, visited, inputNode ?? node);

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

  private cleanGraph() {
    this.nodes.forEach((node) => {
      this._cleanupFn.forEach((e) => e());
      Object.values(node.outputHandles).forEach((handle) => {
        handle.cleanValues();
      });
    });
  }
}

// Tests idea:
//
// - should throw if no input node
// - Should define a max loop threshold, and throw in case of infinite loop

export default NeutronNodeGraph;
