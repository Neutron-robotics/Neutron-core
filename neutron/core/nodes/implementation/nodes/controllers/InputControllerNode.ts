import { IBaseNodeEvent, NodeMessage } from '../../../INeutronNode';
import { NodeInput } from '../../../InputNode';

export abstract class InputControllerNode<TMessageFormat> extends NodeInput {
  public isInput: boolean = true;

  public abstract readonly type: string;

  public isControllerNode = true;

  protected process = async (message: NodeMessage) => message;

  public trigger = async (message: TMessageFormat) => {
    const event: IBaseNodeEvent = {
      nodeId: this.id,
      data: message
    };
    this.ProcessingBegin.trigger(event);
  };

  protected verifyInput = (_: NodeMessage) => {};
}
