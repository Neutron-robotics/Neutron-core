import { getRandomNumber } from "../../../utils/random";
import { sleep } from "../../../utils/time";
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
  protected process = async (input: IfNodeInput) => {
    const delay = getRandomNumber(1000, 5000);
    await sleep(delay);

    if (input)
      return Promise.resolve({
        nodeOutput: {
          isSkipped: false,
          data: input,
        },
      });
    else
      return Promise.resolve({
        nodeOutput: {
          isSkipped: true,
          data: undefined,
        },
      });
  };

  protected formatInput = () => {
    const input = this.inputHandles["nodeInput"]?.value?.data;
    return input;
  };
}

export default IfNode;
