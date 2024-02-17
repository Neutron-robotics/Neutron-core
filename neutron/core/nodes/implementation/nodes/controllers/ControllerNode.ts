import BaseNode from "../../../BaseNode";
import { IBaseNodeEvent, INodeBuilder, NodeMessage } from "../../../INeutronNode";
import { NodeInput } from "../../../InputNode";

abstract class InputControllerNode<TMessageFormat> extends NodeInput {
  public isInput: boolean = true
  public abstract readonly type: string;

  public isControllerNode = true

  constructor(builder: INodeBuilder<{}>) {
    super(builder);
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  public trigger = async (message: TMessageFormat) => {
    const event: IBaseNodeEvent = {
      nodeId: this.id,
      data: message
    }
    this.ProcessingBegin.trigger(event)
  };

  protected verifyInput = (_: NodeMessage) => {};
}

abstract class OutputControllerNode extends BaseNode {
  public isInput: boolean = false
  public abstract readonly type: string;

  public isControllerNode = true

  constructor(builder: INodeBuilder<{}>) {
    super(builder);
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};
} 

export {
  InputControllerNode,
  OutputControllerNode
};
