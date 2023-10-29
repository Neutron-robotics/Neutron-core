import { ConnectionContext } from "../../../context/ConnectionContext";
import { IFrameExecutor, IRosFrameExecutor } from "../../../interfaces/frames";
import { IRos2System, IRos2Topic } from "../../../models/ros2/ros2";
import NeutronGraphError from "../../errors/NeutronGraphError";
import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode, { IRosNode } from "./BaseNode";

export interface IPublisherNodeBuilderSpecifics {
  topicId: string;
}

class PublisherNode<TMessageReceived>
  extends BaseNode<TMessageReceived, any>
  implements IRosNode
{
  public readonly type = "publisherNode";
  private context: ConnectionContext | undefined;
  private topic: IRos2Topic | undefined;
  private _topicId: string;

  constructor(builder: INodeBuilder<IPublisherNodeBuilderSpecifics>) {
    super(builder);
    if (!builder?.specifics?.topicId)
      throw new NeutronGraphError(
        "The topicId is undefined for publisher node"
      );
    this._topicId = builder.specifics.topicId;
  }

  public get isConnected() {
    return this.context?.isConnected ?? false;
  }

  public useRos = (context: ConnectionContext, system: IRos2System) => {
    this.context = context;
    this.topic = system.topics.find((e) => e._id === this._topicId);
  };

  protected process = (input: TMessageReceived) => {
    console.log("PUblishing ", input);

    if (this.isConnected && this.topic) {
      const executor: IRosFrameExecutor = {
        methodType: this.topic.name,
        format: this.topic.messageType.name,
        payload: input,
      };
      this.context!.send(executor);
    }

    return Promise.resolve({});
  };

  protected formatInput = () => {
    const inputHandles = Object.values(this.inputHandles);

    const input = inputHandles.reduce((acc, cur) => {
      if (cur.value) return { ...acc, [cur.propertyName]: cur.value.data };
      return { ...acc };
    }, {});

    return input as TMessageReceived;
  };
}

export default PublisherNode;
