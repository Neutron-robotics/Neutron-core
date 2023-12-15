import { IRos2Topic } from "../../../../../models/ros2/ros2";
import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";
import RosNode from "./RosNode";

export interface SubscriberNodeSpecifics {
  topic: IRos2Topic;
}

class SubscriberNode extends RosNode {
  public isInput: boolean = false;
  public readonly type = "subscriber";
  private readonly specifics: SubscriberNodeSpecifics;

  constructor(builder: INodeBuilder<SubscriberNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};

  public trigger(data: any) {
    this.processNode({ payload: data });
  }

  public override onContextMount = () => {
    this.rosContext?.on(
      {
        methodType: this.specifics.topic.name,
        format: this.specifics.topic.messageType.name,
        payload: null,
      },
      this.trigger
    );
  };
}

export default SubscriberNode;
