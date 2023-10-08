import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

class PublisherNode<TMessageReceived> extends BaseNode<TMessageReceived, any> {
  public readonly type = "publisherNode";

  constructor(builder: INodeBuilder) {
    super(builder);
  }

  protected process = (input: TMessageReceived) => {
    console.log("PUblishing ", input);

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
