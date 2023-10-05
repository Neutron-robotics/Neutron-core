import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

interface BaseControllerNodeOutput {
  value: any;
}

class BaseControllerNode extends BaseNode<void, BaseControllerNodeOutput> {
  public readonly type = "ifNode";

  constructor(builder: INodeBuilder) {
    super(builder);
  }
  protected process = () => {
    return Promise.resolve({});
  };

  protected formatInput = () => {};
}

export default BaseControllerNode;
