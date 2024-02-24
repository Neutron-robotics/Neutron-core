import { ILiteEvent, LiteEvent } from '../../utils/LiteEvent';
import { BaseNode } from './BaseNode';
import { IBaseNodeEvent } from './INeutronNode';

export interface IInputNode {
  isInput: boolean,
  ProcessingBegin: ILiteEvent<IBaseNodeEvent>
  ProcessingFinished: ILiteEvent<string>
  trigger: (data: any) => void
}

export abstract class NodeInput extends BaseNode implements IInputNode {
  public isInput: boolean = true;

  public ProcessingBegin = new LiteEvent<IBaseNodeEvent>();

  public ProcessingFinished = new LiteEvent<string>();

    public abstract trigger(data: any): void
}
