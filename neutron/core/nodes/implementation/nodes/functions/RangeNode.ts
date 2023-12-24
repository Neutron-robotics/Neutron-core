import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

export interface IScale {
  from: number;
  to: number;
}

export interface RangeNodeSpecifics {
  propertyName: string;
  mode: "scale" | "scaleAndLimit" | "scaleAndDeleteOverflow";
  inputScale: IScale;
  outputScale: IScale;
  round: boolean;
}
class RangeNode extends BaseNode {
  public isInput: boolean = true;
  public readonly type = "range";
  private readonly specifics: RangeNodeSpecifics;

  constructor(builder: INodeBuilder<RangeNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    const inputValue = Number(message.payload[this.specifics.propertyName]);

    if (isNaN(inputValue)) {
      throw new Error("Input value must be a number.");
    }

    let scaledValue: number | undefined = this.scaleValue(
      inputValue,
      this.specifics.inputScale,
      this.specifics.outputScale
    );

    if (this.specifics.mode === "scaleAndLimit") {
      scaledValue = this.applyLimits(scaledValue, this.specifics.outputScale);
    }

    if (this.specifics.round) {
      scaledValue = Math.round(scaledValue);
    }

    if (
      this.specifics.mode === "scaleAndDeleteOverflow" &&
      (scaledValue > this.specifics.outputScale.to ||
        scaledValue < this.specifics.outputScale.from)
    ) {
      scaledValue = undefined;
    }
    const outputMessage: NodeMessage = {
      payload: {
        ...message.payload,
        [this.specifics.propertyName]: scaledValue,
      },
    };
    return outputMessage;
  };

  private scaleValue(
    value: number,
    inputScale: IScale,
    outputScale: IScale
  ): number {
    const scaledValue =
      ((value - inputScale.from) / (inputScale.to - inputScale.from)) *
        (outputScale.to - outputScale.from) +
      outputScale.from;

    return scaledValue;
  }

  private applyLimits(value: number, outputScale: IScale): number {
    return Math.max(outputScale.from, Math.min(outputScale.to, value));
  }

  protected verifyInput = (_: NodeMessage) => {};
}

export default RangeNode;
