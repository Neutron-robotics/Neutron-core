import { getRandomNumber } from "../../../utils/random";
import { sleep } from "../../../utils/time";
import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

export interface IPurcentageNodeOutput {
  result: number;
}

class PurcentageNode extends BaseNode<number, IPurcentageNodeOutput> {
  public readonly type = "publisherNode";

  private min: number;
  private max: number;

  constructor(builder: INodeBuilder) {
    super(builder);
    this.min = 0;
    this.max = 100;
  }

  protected process = async (value: number) => {
    if (value < this.min || value > this.max) {
      throw new Error("The value must be included in range.");
    }

    const delay = getRandomNumber(1000, 5000);
    await sleep(delay);

    const range = this.max - this.min;
    const purcentage = ((value - this.min) / range) * 100;

    return Promise.resolve({
      nodeOutput: {
        data: purcentage,
        isSkipped: false,
      },
    });
  };

  protected formatInput = (): number => {
    const value = this.inputHandles["nodeInput"].value?.data;

    if (typeof value !== "number")
      throw new Error("the input of the node must be a number");

    return value;
  };
}

export default PurcentageNode;
