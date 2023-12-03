import BaseNode from "../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../INeutronNode";

export interface ChangeNodeSpecifics {}

class ChangeNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "Change";
  private readonly specifics: ChangeNodeSpecifics;

  constructor(builder: INodeBuilder<ChangeNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default ChangeNode;
