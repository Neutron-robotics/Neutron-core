import { INodeBuilder } from "../NeutronGraphNode";
import { INeutronNode, NeutronNodeDB } from "../NeutronNode";
import BaseControllerNode from "./BaseControllerNode";
import IfNode from "./IfNode";
import PublisherNode, { IPublisherNodeBuilderSpecifics } from "./PublisherNode";
import PurcentageNode from "./PurcentageNode";
import SubscriberNode, { ISubscriberNodeSpecific } from "./SubscriberNode";

class NodeFactory {
  static nodeFactory: Record<
    string,
    (builder: INodeBuilder<any>) => INeutronNode<any, any>
  > = {
    ["ifNode"]: (builder: INodeBuilder<void>) => new IfNode(builder),
    ["publisherNode"]: (
      builder: INodeBuilder<IPublisherNodeBuilderSpecifics>
    ) => new PublisherNode(builder),
    ["purcentageNode"]: (builder: INodeBuilder<void>) =>
      new PurcentageNode(builder),
    ["subscriberNode"]: (builder: INodeBuilder<ISubscriberNodeSpecific>) =>
      new SubscriberNode(builder),
    ["baseControllerNode"]: (builder: INodeBuilder<void>) =>
      new BaseControllerNode(builder),
  };

  static createNode(nodeDb: NeutronNodeDB): INeutronNode<any, any> | null {
    const factory = NodeFactory.nodeFactory[nodeDb.type];

    if (factory) {
      return factory(nodeDb);
    }
    return null;
  }
}

export default NodeFactory;
