import { IBaseNodeEvent, INodeBuilder, NodeMessage } from "../../../INeutronNode";
import { NodeInput } from "../../../InputNode";

abstract class ControllerNode<TMessageFormat> extends NodeInput {
  public isInput: boolean = true;
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

export default ControllerNode;
