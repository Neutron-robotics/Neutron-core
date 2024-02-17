import { IRos2Topic } from '../../../../../models/ros2/ros2';
import BaseNode from '../../../BaseNode';
import {
  IBaseNodeEvent,
  INodeBuilder,
  NodeMessage
} from '../../../INeutronNode';
import { RosNodeInput } from './RosNode';

export interface SubscriberNodeSpecifics {
  topic: IRos2Topic;
}

class SubscriberNode extends RosNodeInput {
  public isInput: boolean = true;

  public readonly type = 'subscriber';

  private readonly specifics: SubscriberNodeSpecifics;

  constructor(builder: INodeBuilder<SubscriberNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => Promise.resolve(message);

  protected verifyInput = (_: NodeMessage) => {};

  public trigger = async (data: any) => {
    const event: IBaseNodeEvent = {
      nodeId: this.id,
      data
    };

    this.ProcessingBegin.trigger(event);
  };

  public override onContextMount = () => {
    this.rosContext?.subscribe(
      this.specifics.topic.name,
      this.specifics.topic.messageType.name,
      this.trigger
    );
  };
}

export default SubscriberNode;
