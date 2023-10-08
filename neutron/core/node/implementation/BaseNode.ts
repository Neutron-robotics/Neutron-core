import { ILiteEvent, LiteEvent } from "../../../utils/LiteEvent";
import XYPosition from "../../utils/XYPosition";
import { INodeBuilder } from "../NeutronGraphNode";
import {
  HandleNodeValue,
  NeutronInputHandle,
  NeutronOutputHandle,
} from "../NeutronHandle";
import {
  IExecutionStageEvent,
  INeutronNode,
  NodeExecutionStage,
} from "../NeutronNode";

abstract class BaseNode<TInput, TOutput>
  implements INeutronNode<TInput, TOutput>
{
  public readonly id: string;
  public abstract type: string;
  public position: XYPosition;
  public inputHandles: Record<string, NeutronInputHandle<any>>;
  public outputHandles: Record<string, NeutronOutputHandle>;

  public executionStage: ILiteEvent<IExecutionStageEvent>;

  constructor(builder: INodeBuilder) {
    this.id = builder.id;
    this.position = builder.position;
    this.inputHandles = {};
    this.outputHandles = {};
    this.executionStage = new LiteEvent<IExecutionStageEvent>();
  }

  protected abstract process: (
    input: TInput
  ) => Promise<Record<string, HandleNodeValue<any>>>;

  protected abstract formatInput: () => TInput;

  public async processNode(): Promise<void> {
    let input = null;

    this.executionStage.trigger({
      nodeId: this.id,
      event: NodeExecutionStage.BeforeProcess,
    });

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
      this.executionStage.trigger({
        nodeId: this.id,
        event: NodeExecutionStage.Skipped,
      });
      return;
    }

    try {
      input = this.formatInput();
    } catch (err: any) {
      console.error(`${this.id} Error happens while formatting input`, err);
      this.executionStage.trigger({
        nodeId: this.id,
        event: NodeExecutionStage.Error,
      });
      return;
    }

    this.executionStage.trigger({
      nodeId: this.id,
      event: NodeExecutionStage.Processing,
    });
    const output = await this.process(input);

    for (const [key, handle] of Object.entries(this.outputHandles)) {
      handle.setValue(output[key]);
    }
    this.executionStage.trigger({
      nodeId: this.id,
      event: NodeExecutionStage.Processed,
    });
  }
}

export default BaseNode;
