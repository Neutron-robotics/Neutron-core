import NeutronNodeComputeError from "../../../../errors/NeutronNodeError";
import BaseNode from "../../../BaseNode";
import {
  INodeBuilder,
  NodeMessage,
  OutputNodeMessage,
} from "../../../INeutronNode";

export interface IFilterNodeChange {
  type: "latest" | "latestValid";
  value: number;
}

export interface FilterNodeSpecifics {
  mode: "block" | "blockUnlessGreater" | "blockUnlessLower";
  value?: IFilterNodeChange;
  propertyName: string;
}

class FilterNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "filter";
  private readonly specifics: FilterNodeSpecifics;
  private previousValue: any = null;
  private previousValidValue: any = null;

  constructor(builder: INodeBuilder<FilterNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (
    message: NodeMessage
  ): Promise<OutputNodeMessage> => {
    let shouldContinue = true;

    switch (this.specifics.mode) {
      case "block":
        // If the previous value is null, it is the first time. In that case we
        // save the value and return a valid output
        if (this.previousValue === null) {
          shouldContinue = true;
          break;
        }
        shouldContinue =
          message.payload[this.specifics.propertyName] !== this.previousValue;
        break;
      case "blockUnlessGreater":
        shouldContinue = this.blockUnlessGreaterShouldContinue(message.payload);
        break;
      case "blockUnlessLower":
        shouldContinue = this.blockUnlessLowerShouldContinue(message.payload);
        break;
      default:
        throw new NeutronNodeComputeError(
          `Unknown mode ${this.specifics.mode}`
        );
    }

    this.previousValue = message.payload[this.specifics.propertyName];

    return {
      payload: message.payload,
      outputHandles: shouldContinue ? undefined : [],
    };
  };

  private blockUnlessGreaterShouldContinue(payload: any): boolean {
    const cachedValue =
      this.specifics.value?.type == "latest"
        ? this.previousValue
        : this.previousValidValue;

    if (cachedValue === null) {
      this.previousValue = payload[this.specifics.propertyName];
      this.previousValidValue = payload[this.specifics.propertyName];
      return true;
    }

    return (
      payload[this.specifics.propertyName] >
      cachedValue + this.specifics.value?.value
    );
  }

  private blockUnlessLowerShouldContinue(payload: any): boolean {
    const cachedValue =
      this.specifics.value?.type == "latest"
        ? this.previousValue
        : this.previousValidValue;

    if (cachedValue === null) {
      this.previousValue = payload[this.specifics.propertyName];
      this.previousValidValue = payload[this.specifics.propertyName];
      return true;
    }

    return (
      payload[this.specifics.propertyName] <
      cachedValue + this.specifics.value?.value
    );
  }

  protected verifyInput = (_: NodeMessage) => {};
}

export default FilterNode;
