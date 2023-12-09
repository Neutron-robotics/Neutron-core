import { IRos2Topic } from "../../../../../models/ros2/ros2";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";
import RosNode from "./RosNode";

interface PublisherNodeSpecifics {
  topic: IRos2Topic;
}

class PublisherNode extends RosNode {
  public isInput: boolean = false;
  public readonly type = "publisher";
  private readonly specifics: PublisherNodeSpecifics;

  constructor(builder: INodeBuilder<PublisherNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    this.rosContext?.send({
      methodType: this.specifics.topic.name,
      format: this.specifics.topic.messageType.name,
      payload: message.payload,
    });
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};

  public override onContextMount = () => {};
}

export default PublisherNode;
