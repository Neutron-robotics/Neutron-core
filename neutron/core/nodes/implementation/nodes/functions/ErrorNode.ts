import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

export interface IErrorEvent {
  log: string;
  closeAuto: boolean;
  ack: boolean;
}

interface ErrorNodeSpecifics {
  output: "full" | "property";
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
}

class ErrorNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "error";
  public ErrorEvent: ILiteEvent<IErrorEvent>;
  public specifics: ErrorNodeSpecifics;

  constructor(builder: INodeBuilder<ErrorNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
    this.ErrorEvent = new LiteEvent<IErrorEvent>();
  }

  protected process = async (message: NodeMessage) => {
    const log =
      this.specifics.output === "full"
        ? message.payload
        : message.payload[this.specifics.propertyName ?? ""];

    this.ErrorEvent.trigger({
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack,
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default ErrorNode;
