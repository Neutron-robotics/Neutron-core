import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

export interface ISubscriberNodeSpecific {
  topicId: string;
}

class SubscriberNode extends BaseNode<any, any> {
  public readonly type = "subscriberNode";

  constructor(builder: INodeBuilder<ISubscriberNodeSpecific>) {
    super(builder);
  }

  protected process = (input: any) => {
    return Promise.resolve({});
  };

  protected formatInput = () => {};
}

export default SubscriberNode;
