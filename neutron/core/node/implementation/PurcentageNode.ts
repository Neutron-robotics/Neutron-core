import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

export interface IPurcentageNodeInput {
  value: number;
}

export interface IPurcentageNodeOutput {
  result: number;
}

class PurcentageNode extends BaseNode<
  IPurcentageNodeInput,
  IPurcentageNodeOutput
> {
  public readonly type = "publisherNode";

  private min: number;
  private max: number;

  constructor(builder: INodeBuilder) {
    super(builder);
    this.min = 0;
    this.max = 100;
  }

  protected process = (input: any) => {
    const result = input;

    return Promise.resolve({});
  };

  protected formatInput = () => {
    const input = {
      value: this.inputHandles["value"].value?.data,
    };
    return input;
  };
}

export default PurcentageNode;
