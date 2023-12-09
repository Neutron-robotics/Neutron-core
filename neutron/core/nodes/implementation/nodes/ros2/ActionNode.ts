import { IRos2Action } from "../../../../../../dist";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";
import RosNode from "./RosNode";

interface ActionrNodeSpecifics {
  action: IRos2Action;
}

class ActionrNode extends RosNode {
  public isInput: boolean = false;
  public readonly type = "action";
  private readonly specifics: ActionrNodeSpecifics;

  constructor(builder: INodeBuilder<ActionrNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    // Not implemented
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};

  public override onContextMount = () => {};
}

export default ActionrNode;
