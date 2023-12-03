import NeutronGraphError from "../errors/NeutronGraphError";
import { NeutronNodeDB } from "../node/NeutronNode";
import BaseNode from "./BaseNode";
import { INeutronNode, INodeBuilder } from "./INeutronNode";
import ChangeNode from "./implementation/nodes/ChangeNode";
import DebugNode from "./implementation/nodes/DebugNode";
import DelayNode from "./implementation/nodes/DelayNode";
import FunctionNode from "./implementation/nodes/FunctionNode";
import InjectNode from "./implementation/nodes/InjectNode";
import SwitchNode from "./implementation/nodes/SwitchNode";

export const inputNodesSet = new Set(["inject"]);

class NodeFactory {
  static nodeFactory: Record<string, (builder: INodeBuilder<any>) => BaseNode> =
    {
      inject: (builder: INodeBuilder<any>) => new InjectNode(builder),
      change: (builder: INodeBuilder<any>) => new ChangeNode(builder),
      debug: (builder: INodeBuilder<any>) => new DebugNode(builder),
      function: (builder: INodeBuilder<any>) => new FunctionNode(builder),
      switch: (builder: INodeBuilder<any>) => new SwitchNode(builder),
      delay: (builder: INodeBuilder<any>) => new DelayNode(builder),
    };

  static createNode(nodeDb: NeutronNodeDB): BaseNode {
    const factory = NodeFactory.nodeFactory[nodeDb.data.name];

    const builder: INodeBuilder<any> = {
      id: nodeDb.id,
      type: nodeDb.data.name,
      position: nodeDb.position,
      specifics: nodeDb.data.specifics,
    };

    if (factory) {
      return factory(builder);
    }
    throw new NeutronGraphError("Failed to build the graph, unknown node ");
  }
}

export default NodeFactory;
