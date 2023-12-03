import BaseNode from "../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../INeutronNode";

export interface FunctionNodeSpecifics {}

class FunctionNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "function";
  private readonly specifics: FunctionNodeSpecifics;

  constructor(builder: INodeBuilder<FunctionNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    return message;
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default FunctionNode;
