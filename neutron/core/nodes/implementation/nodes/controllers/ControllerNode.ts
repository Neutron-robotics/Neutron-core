import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

abstract class ControllerNode<TMessageFormat> extends BaseNode {
  public isInput: boolean = true;
  public abstract readonly type: string;

  constructor(builder: INodeBuilder<{}>) {
    super(builder);
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  public trigger = async (message: TMessageFormat) => {
    this.processNode({
      payload: message,
    });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default ControllerNode;
