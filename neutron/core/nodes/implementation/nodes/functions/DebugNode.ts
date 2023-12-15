import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import {
  INodeBuilder,
  NodeMessage,
  OutputNodeMessage,
} from "../../../INeutronNode";

export interface IDebugEvent {
  log: string;
}

export interface DebugNodeSpecifics {
  output: "full" | "property";
  propertyName?: string;
}

class DebugNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "debug";
  public DebugEvent: ILiteEvent<IDebugEvent>;

  constructor(builder: INodeBuilder<void>) {
    super(builder);
    this.DebugEvent = new LiteEvent<IDebugEvent>();
  }

  protected process = async (
    message: NodeMessage
  ): Promise<OutputNodeMessage> => {
    if (typeof message.payload === "string") {
      this.DebugEvent.trigger({
        log: message.payload,
      });
    } else if (typeof message.payload === "object") {
      this.DebugEvent.trigger({
        log: JSON.stringify(message.payload),
      });
    }
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default DebugNode;
