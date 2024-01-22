import NeutronNodeComputeError from "../../../../errors/NeutronNodeError";
import BaseNode from "../../../BaseNode";
import {
  INodeBuilder,
  NeutronPrimitiveType,
  NodeMessage,
  OutputNodeMessage,
} from "../../../INeutronNode";

export const comparisonOperators = ["==", "!=", "<", "<=", ">", ">="] as const;
export type ComparisonOperator = (typeof comparisonOperators)[number];

export interface SwitchField<T> {
  type: NeutronPrimitiveType;
  value: T;
  operator: ComparisonOperator;
  id: string;
}

// TODO: Renommer dans l'ui
export interface SwitchNodeSpecifics {
  propertyName: string;
  switchFields: SwitchField<any>[];
  switchMode: "stop" | "continue";
}

class SwitchNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "switch";
  private readonly specifics: SwitchNodeSpecifics;

  constructor(builder: INodeBuilder<SwitchNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = (
    message: NodeMessage
  ): Promise<OutputNodeMessage> => {
    const { propertyName, switchFields, switchMode } = this.specifics;
    const messagePropertyValue = message.payload[propertyName];
    const handleNames: string[] = [];
    let shouldForward = true;

    switchFields.forEach((switchField, i) => {
      const { value, operator } = switchField;
      const handleName = `output-${i}`;

      if (!shouldForward) return;

      let evaluation = false;
      switch (operator) {
        case "!=":
          evaluation = messagePropertyValue !== value;
          break;
        case "<":
          evaluation = messagePropertyValue < value;
          break;
        case "<=":
          evaluation = messagePropertyValue <= value;
          break;
        case ">":
          evaluation = messagePropertyValue > value;
          break;
        case ">=":
          evaluation = messagePropertyValue >= value;
          break;
        case "==":
          evaluation = messagePropertyValue === value;
          break;
        default:
          throw new NeutronNodeComputeError(
            `Operator ${operator} is not supported`
          );
      }
      if (evaluation) handleNames.push(handleName);
      if (switchMode === "stop" && evaluation) shouldForward = false;
    });

    return Promise.resolve({
      payload: message.payload,
      outputHandles: handleNames,
    });
  };
  protected verifyInput = (_: NodeMessage) => {};
}

export default SwitchNode;
