import NeutronGraphError from "../errors/NeutronGraphError";
import BaseNode from "./BaseNode";
import { INodeBuilder, NeutronNodeDB } from "./INeutronNode";
import ChangeNode from "./implementation/nodes/functions/ChangeNode";
import DebugNode from "./implementation/nodes/functions/DebugNode";
import DelayNode from "./implementation/nodes/functions/DelayNode";
import ErrorNode from "./implementation/nodes/functions/ErrorNode";
import FilterNode from "./implementation/nodes/functions/FilterNode";
import FunctionNode from "./implementation/nodes/functions/FunctionNode";
import InjectNode from "./implementation/nodes/functions/InjectNode";
import RangeNode from "./implementation/nodes/functions/RangeNode";
import SwitchNode from "./implementation/nodes/functions/SwitchNode";
import TemplateNode from "./implementation/nodes/functions/TemplateNode";

export const inputNodesSet = new Set(["inject"]);

class NodeFactory {
  static nodeFactory: Record<string, (builder: INodeBuilder<any>) => BaseNode> =
    {
      inject: (builder: INodeBuilder<any>) => new InjectNode(builder),
      change: (builder: INodeBuilder<any>) => new ChangeNode(builder),
      debug: (builder: INodeBuilder<any>) => new DebugNode(builder),
      error: (builder: INodeBuilder<any>) => new ErrorNode(builder),
      function: (builder: INodeBuilder<any>) => new FunctionNode(builder),
      switch: (builder: INodeBuilder<any>) => new SwitchNode(builder),
      delay: (builder: INodeBuilder<any>) => new DelayNode(builder),
      filter: (builder: INodeBuilder<any>) => new FilterNode(builder),
      range: (builder: INodeBuilder<any>) => new RangeNode(builder),
      template: (builder: INodeBuilder<any>) => new TemplateNode(builder),
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
