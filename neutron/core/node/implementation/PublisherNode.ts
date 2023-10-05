import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

class PublisherNode extends BaseNode<any, any> {
  public readonly type = "publisherNode";

  constructor(builder: INodeBuilder) {
    super(builder);
  }

  protected process = (input: any) => {
    return Promise.resolve({});
  };

  protected formatInput = () => {};
}

export default PublisherNode;
