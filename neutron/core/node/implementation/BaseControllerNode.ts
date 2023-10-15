import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode from "./BaseNode";

interface IBaseControllerInput {
  top: number;
  left: number;
  right: number;
  bottom: number;
  speed: number;
}

class BaseControllerNode extends BaseNode<void, IBaseControllerInput> {
  public readonly type = "ifNode";

  private value: Partial<IBaseControllerInput> | undefined;

  constructor(builder: INodeBuilder) {
    super(builder);
  }

  public sendInput(input: Partial<IBaseControllerInput>): void {
    this.value = input;
    super.processNode();
  }

  protected process = () => {
    const output = Object.entries(this.value ?? {}).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: { data: value, isSkipped: false },
      }),
      {}
    );

    return Promise.resolve(output);
  };

  protected formatInput = () => {
    if (!this.value)
      throw new Error(
        "Value for BaseControllerNode is undefined but the node is yet invoked"
      );
  };
}

export default BaseControllerNode;
