import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

interface IRandomDelayInterval {
  min: number;
  max: number;
}

interface DelayNodeSpecifics {
  mode: "fixed" | "random";
  delay: number | IRandomDelayInterval;
  unit: "millisecond" | "second" | "minute" | "hour";
}

class DelayNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "delay";
  private readonly specifics: DelayNodeSpecifics;

  constructor(builder: INodeBuilder<DelayNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    const { delay, unit, mode } = this.specifics;
    const delayInMillis = this.calculateDelayInMillis();

    if (mode === "random") {
      console.log(`Applying random delay of ${delayInMillis} milliseconds`);
    } else {
      console.log(`Applying fixed delay of ${delayInMillis} milliseconds`);
    }

    // Simulate delay with setTimeout
    await new Promise((resolve) => setTimeout(resolve, delayInMillis));

    // Continue processing the message or perform any other desired action
    console.log("Message processed after delay:", message.payload);
    return message;
  };

  protected verifyInput = (message: NodeMessage) => {};

  private calculateDelayInMillis(): number {
    const { delay, unit } = this.specifics;
    let delayInMillis: number;

    if (typeof delay === "number") {
      delayInMillis = this.convertToMilliseconds(delay, unit);
    } else {
      // For random delay, calculate a random value within the specified interval
      const { min, max } = delay;
      delayInMillis = Math.floor(Math.random() * (max - min + 1) + min);
    }

    return delayInMillis;
  }

  private convertToMilliseconds(value: number, unit: string): number {
    switch (unit) {
      case "second":
        return value * 1000;
      case "minute":
        return value * 60 * 1000;
      case "hour":
        return value * 60 * 60 * 1000;
      default:
        return value;
    }
  }
}

export default DelayNode;
