import { ConnectionContext } from "../../../context/ConnectionContext";
import { RosContext } from "../../../context/RosContext";
import { IRos2System } from "../../../models/ros2/ros2";
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
  IExecutionStageProcessingEvent,
  INeutronNode,
} from "../NeutronNode";

export interface IRosNode {
  useRos: (context: RosContext, system: IRos2System) => void;
  isConnected: boolean;
}

export interface NodeMessage {
  payload: any
}

abstract class BaseNode<TInput, TOutput>
  implements INeutronNode<TInput, TOutput>
{
  public readonly id: string;
  public abstract type: string;
  public position: XYPosition;
  public inputHandles: Record<string, NeutronInputHandle<any>>;
  public outputHandles: Record<string, NeutronOutputHandle>;

  public BeforeProcessingEvent: ILiteEvent<
    IExecutionStageProcessingEvent<TInput>
  >;
  public AfterProcessingEvent: ILiteEvent<
    IExecutionStageProcessingEvent<TOutput>
  >;
  public ProcessingErrorEvent: ILiteEvent<IExecutionStageEvent>;
  public SkippedNodeEvent: ILiteEvent<IExecutionStageEvent>;

  constructor(builder: INodeBuilder<any>) {
    this.id = builder.id;
    this.position = builder.position;
    this.inputHandles = {};
    this.outputHandles = {};
    this.BeforeProcessingEvent = new LiteEvent<
      IExecutionStageProcessingEvent<Partial<TInput>>
    >();
    this.AfterProcessingEvent = new LiteEvent<
      IExecutionStageProcessingEvent<Partial<TOutput>>
    >();
    this.ProcessingErrorEvent = new LiteEvent<IExecutionStageEvent>();
    this.SkippedNodeEvent = new LiteEvent<IExecutionStageEvent>();
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
      this.SkippedNodeEvent.trigger({
        nodeId: this.id,
      });
      return;
    }

    try {
      input = this.formatInput();
    } catch (err: any) {
      console.error(`${this.id} Error happens while formatting input`, err);
      this.ProcessingErrorEvent.trigger({
        nodeId: this.id,
      });
      return;
    }

    this.BeforeProcessingEvent.trigger({
      nodeId: this.id,
      data: input,
    });
    const output = await this.process(input);

    for (const [key, handle] of Object.entries(this.outputHandles)) {
      handle.setValue(output[key]);
    }

    const outputObject = Object.entries(output).reduce(
      (acc, [key, cur]) => ({ ...acc, [key]: cur.data }),
      {}
    ) as Partial<TOutput>;
    this.AfterProcessingEvent.trigger({
      nodeId: this.id,
      data: outputObject,
    });
  }
}

export default BaseNode;
