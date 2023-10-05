import { ILiteEvent, LiteEvent } from "../../../utils/LiteEvent";
import XYPosition from "../../utils/XYPosition";
import { INodeBuilder } from "../NeutronGraphNode";
import {
  HandleNodeValue,
  NeutronInputHandle,
  NeutronOutputHandle,
} from "../NeutronHandle";
import { INeutronNode, INeutronNodeInputParams } from "../NeutronNode";

abstract class BaseNode<TInput, TOutput>
  implements INeutronNode<TInput, TOutput>
{
  public readonly id: string;
  public abstract type: string;
  public position: XYPosition;
  public inputHandles: Record<string, NeutronInputHandle<any>>;
  public outputHandles: Record<string, NeutronOutputHandle>;

  public errorTriggered: ILiteEvent<string>;

  protected hasProcessed: boolean;

  constructor(builder: INodeBuilder) {
    this.id = builder.id;
    this.position = builder.position;
    this.inputHandles = {};
    this.outputHandles = {};
    this.hasProcessed = false;
    this.errorTriggered = new LiteEvent<string>();
  }

  protected abstract process: (
    input: TInput
  ) => Promise<Record<string, HandleNodeValue<any>>>;

  protected abstract formatInput: () => TInput;

  public async processNode(): Promise<void> {
    let input = null;

    const inputHandles = Object.entries(this.inputHandles);
    if (
      inputHandles.length &&
      inputHandles.every(([key, handle]) => handle.value?.isSkipped)
    ) {
      for (const [key, handle] of Object.entries(this.outputHandles)) {
        handle.setValue({
          isSkipped: true,
          data: undefined,
        });
      }
    }

    try {
      input = this.formatInput();
    } catch (err: any) {
      this.errorTriggered.trigger(err);
      return;
    }

    const output = await this.process(input);

    for (const [key, handle] of Object.entries(this.outputHandles)) {
      handle.setValue(output[key]);
    }
  }
}

export default BaseNode;
