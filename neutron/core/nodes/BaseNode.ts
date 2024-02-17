import { ILiteEvent, LiteEvent } from '../../utils/LiteEvent';
import XYPosition from '../../types/XYPosition';
import {
  IBaseNodeEvent,
  INeutronNode,
  INodeBuilder,
  NodeMessage,
  OutputNodeMessage
} from './INeutronNode';

abstract class BaseNode implements INeutronNode {
  public readonly id: string;

  public abstract type: string;

  public abstract isInput: boolean;

  public position: XYPosition;

  public nextNodes: Record<string, BaseNode[]> = {};

  public BeforeProcessingEvent: ILiteEvent<IBaseNodeEvent>;

  public AfterProcessingEvent: ILiteEvent<IBaseNodeEvent>;

  public ProcessingErrorEvent: ILiteEvent<IBaseNodeEvent>;

  public get nextNodeToArray() {
    const formattedArray: { key: string; node: BaseNode }[] = [];

    for (const key in this.nextNodes) {
      if (this.nextNodes.hasOwnProperty(key)) {
        const nodes = this.nextNodes[key];
        nodes.forEach(node => {
          formattedArray.push({ key, node });
        });
      }
    }

    return formattedArray;
  }

  constructor(builder: INodeBuilder<any>) {
    this.id = builder.id;
    this.position = builder.position;
    this.BeforeProcessingEvent = new LiteEvent<IBaseNodeEvent>();
    this.AfterProcessingEvent = new LiteEvent<IBaseNodeEvent>();
    this.ProcessingErrorEvent = new LiteEvent<IBaseNodeEvent>();
  }

  protected abstract process: (
    input: NodeMessage
  ) => Promise<OutputNodeMessage>;

  protected abstract verifyInput: (input: NodeMessage) => void;

  public async processNode(
    input: NodeMessage
  ): Promise<OutputNodeMessage | undefined> {
    try {
      this.verifyInput(input);
    } catch (err: any) {
      console.error(`${this.id} Error happens while formatting input`, err);
      this.ProcessingErrorEvent.trigger({
        nodeId: this.id,
        data: err
      });
      return;
    }

    this.BeforeProcessingEvent.trigger({
      nodeId: this.id,
      data: input
    });
    const output = await this.process(input);
    this.AfterProcessingEvent.trigger({
      nodeId: this.id,
      data: output
    });
    return Promise.resolve({
      ...output,
      outputHandles: output.outputHandles ?? Object.keys(this.nextNodes)
    });
  }
}

export default BaseNode;
