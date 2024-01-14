import { RosContext } from "../../../../../context/RosContext";
import { LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import { IBaseNodeEvent } from "../../../INeutronNode";
import { IInputNode } from "../../../InputNode";

abstract class RosNode extends BaseNode {
  public abstract readonly type:
    | "subscriber"
    | "publisher"
    | "service"
    | "action";
  protected rosContext?: RosContext;

  public useRosContext(rosContext: RosContext) {
    this.rosContext = rosContext;
    this.onContextMount();
  }

  public abstract onContextMount: () => void;
}

export abstract class RosNodeInput extends RosNode implements IInputNode{
  public isInput: boolean = true

  public ProcessingBegin = new LiteEvent<IBaseNodeEvent>()
  public ProcessingFinished = new LiteEvent<string>()

  public abstract trigger(data: any): void
}

export default RosNode;
