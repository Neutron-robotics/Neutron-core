import NeutronNodeComputeError from "../../../errors/NeutronNodeError";
import BaseNode from "../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../INeutronNode";

interface ChangeField {
  id: string;
  mode: "define" | "remove" | "move";
  inputField: string;
  targetField?: string;
}

interface ChangeNodeSpecifics {
  fields: ChangeField[];
}

class ChangeNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "Change";
  private readonly specifics: ChangeNodeSpecifics;

  constructor(builder: INodeBuilder<ChangeNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    let modifiedPayload = { ...message.payload };

    for (const field of this.specifics.fields) {
      switch (field.mode) {
        case "define":
          if (!field.targetField) break;
          modifiedPayload[field.targetField] =
            modifiedPayload[field.inputField];
          break;
        case "remove":
          delete modifiedPayload[field.inputField];
          break;
        case "move":
          if (
            field.targetField &&
            modifiedPayload.hasOwnProperty(field.inputField)
          ) {
            modifiedPayload[field.targetField] =
              modifiedPayload[field.inputField];
            delete modifiedPayload[field.inputField];
          }
          break;
        default:
          throw new NeutronNodeComputeError(
            `Mode ${field.mode} is not supported`
          );
      }
    }

    return { payload: modifiedPayload };
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default ChangeNode;
