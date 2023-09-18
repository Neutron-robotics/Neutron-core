import XYPosition from "../utils/XYPosition";
import {
  INeutronInputHandle,
  INeutronOutputHandle,
  NeutronEdgeDB,
} from "./NeutronHandle";
import { INeutronNode, NeutronNodeDB } from "./NeutronNode";

export interface INeutronGraphNode {
  inputNode: INeutronNode;
  findNode: (
    inputNode: INeutronNode,
    target: string
  ) => INeutronNode | undefined;
}

interface INodeBuilder {
  id: string;
  type: string;
  position: XYPosition;
}

function makeNodeGraph(
  nodes: NeutronNodeDB[],
  edges: NeutronEdgeDB[]
): INeutronGraphNode {
  const inputNode = nodes.find((e) => e.input);
  if (!inputNode) throw new Error("No input node");

  const nodeBuilder = {
    id: inputNode.id,
    type: inputNode.type,
    position: inputNode.position,
  };
  const inputNeutronNode = makeNode(nodeBuilder, nodes, edges);
  return {
    inputNode: inputNeutronNode,
    findNode,
  };
}

function makeNode(
  nodeBuilder: INodeBuilder,
  nodes: NeutronNodeDB[],
  edges: NeutronEdgeDB[]
): INeutronNode {
  const node: INeutronNode = {
    id: nodeBuilder.id,
    type: nodeBuilder.type,
    position: nodeBuilder.position,
    inputHandles: [],
    outputHandles: [],
    process: () => {},
  };
  const outputEdges = edges.filter((e) => e.source === node.id);

  for (const edge of outputEdges) {
    const target = nodes.find((e) => e.id === edge.target);
    if (!target)
      throw new Error(
        `The node ${edge.target} defined by edge ${edge.id} could not be found while building graph`
      );
    const nodeBuilder = {
      id: target.id,
      type: target.type,
      position: target.position,
    };

    const targetNode =
      findNode(node, nodeBuilder.id) ?? makeNode(nodeBuilder, nodes, edges);
    const outputHandle: INeutronOutputHandle = {
      id: edge.id,
      type: "output",
      node: targetNode,
    };
    const inputHandle: INeutronInputHandle = {
      id: edge.id,
      type: "input",
      node,
    };
    node.outputHandles.push(outputHandle);
    targetNode.inputHandles.push(inputHandle);
  }

  return node;
}

function findNode(
  inputNode: INeutronNode,
  targetId: string
): INeutronNode | undefined {
  for (const handle of inputNode.outputHandles) {
    if (handle.node.id === targetId) return handle.node;
    else {
      const node = findNode(handle.node, targetId);
      if (node) return node;
    }
  }
}

// Tests idea:
//
// - should throw if no input node
// - Should define a max loop threshold, and throw in case of infinite loop

export default makeNodeGraph;
