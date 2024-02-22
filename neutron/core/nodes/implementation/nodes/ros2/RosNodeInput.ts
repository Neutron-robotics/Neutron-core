import { LiteEvent } from '../../../../../utils';
import { IBaseNodeEvent } from '../../../INeutronNode';
import { IInputNode } from '../../../InputNode';
import { RosNode } from './RosNode';

export abstract class RosNodeInput extends RosNode implements IInputNode {
  public isInput: boolean = true;

  public ProcessingBegin = new LiteEvent<IBaseNodeEvent>();

  public ProcessingFinished = new LiteEvent<string>();

    public abstract trigger(data: any): void
}
