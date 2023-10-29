import { INeutronNode } from "./NeutronNode";

const rosNodes = ["publisherNode", "subscriberNode"];

const isRosNode = (node: INeutronNode<any, any>) => {
  return rosNodes.includes(node.type);
};

export { isRosNode };
