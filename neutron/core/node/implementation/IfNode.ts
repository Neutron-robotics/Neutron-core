import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

interface IfNodeInput {
  value: any;
}

interface IfNodeOutput {
  value: any;
}

class IfNode extends BaseNode<
  IfNodeInput,
  NonNullable<IfNodeOutput> | undefined
> {
  public readonly type = "ifNode";

  constructor(builder: INodeBuilder) {
    super(builder);
  }
  protected process = (input: IfNodeInput) => {
    if (input)
      return Promise.resolve({
        result: {
          isSkipped: false,
          data: input.value,
        },
      });
    else
      return Promise.resolve({
        result: {
          isSkipped: true,
          data: undefined,
        },
      });
  };

  protected formatInput = () => {
    const input = {
      value: this.inputHandles["value"].value,
    };
    return input;
  };
}

export default IfNode;
