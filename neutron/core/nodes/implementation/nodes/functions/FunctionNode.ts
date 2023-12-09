import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

export interface FunctionNodeSpecifics {
  code: string;
}

class FunctionNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "function";
  private readonly specifics: FunctionNodeSpecifics;

  constructor(builder: INodeBuilder<FunctionNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    const func = new Function("msg", this.specifics.code);
    const result = func(message);
    return result;
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default FunctionNode;
