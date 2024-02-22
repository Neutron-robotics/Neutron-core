import { IRos2Topic } from '../../../../../models/ros2/ros2';
import { INodeBuilder, NodeMessage } from '../../../INeutronNode';
import { RosNode } from './RosNode';

export interface PublisherNodeSpecifics {
  topic: IRos2Topic;
}

export class PublisherNode extends RosNode {
  public isInput: boolean = false;

  public readonly type = 'publisher';

  private readonly specifics: PublisherNodeSpecifics;

  constructor(builder: INodeBuilder<PublisherNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    this.rosContext?.publish(
      this.specifics.topic.name,
      this.specifics.topic.messageType.name,
      message.payload
    );
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};

  public override onContextMount = () => {};
}
