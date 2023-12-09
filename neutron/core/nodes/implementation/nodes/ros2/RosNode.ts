import { RosContext } from "../../../../../context/RosContext";
import BaseNode from "../../../BaseNode";

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

export default RosNode;
