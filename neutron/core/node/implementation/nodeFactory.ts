import { INodeBuilder } from "../NeutronGraphNode";
import { INeutronNode } from "../NeutronNode";
import BaseControllerNode from "./BaseControllerNode";
import IfNode from "./IfNode";
import PublisherNode from "./PublisherNode";
import PurcentageNode from "./PurcentageNode";
import SubscriberNode from "./SubscriberNode";

class NodeFactory {
  static nodeFactory: Record<
    string,
    (builder: INodeBuilder) => INeutronNode<any, any>
  > = {
    ["ifNode"]: (builder: INodeBuilder) => new IfNode(builder),
    ["publisherNode"]: (builder: INodeBuilder) => new PublisherNode(builder),
    ["purcentageNode"]: (builder: INodeBuilder) => new PurcentageNode(builder),
    ["subscriberNode"]: (builder: INodeBuilder) => new SubscriberNode(builder),
    ["baseControllerNode"]: (builder: INodeBuilder) =>
      new BaseControllerNode(builder),
  };

  static createNode(builder: INodeBuilder): INeutronNode<any, any> | null {
    const factory = NodeFactory.nodeFactory[builder.type];
    if (factory) {
      return factory(builder);
    }
    return null;
  }
}

export default NodeFactory;
