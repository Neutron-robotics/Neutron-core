import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import {
  INodeBuilder,
  NodeMessage,
  OutputNodeMessage,
} from "../../../INeutronNode";

export interface IDebugEvent {
  id: string;
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
    this.DebugEvent.trigger({
      id: this.id,
      log: message.payload,
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default DebugNode;
