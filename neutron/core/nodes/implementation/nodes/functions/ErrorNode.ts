import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage, OutputNodeMessage } from "../../../INeutronNode";

export interface IErrorEvent {
  id: string;
  log: string;
  closeAuto: boolean;
  ack: boolean;
  exception: string;
}

export interface ErrorNodeSpecifics {
  output: "full" | "property";
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
  exception: string;
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

  protected process = async (message: NodeMessage): Promise<OutputNodeMessage> => {
    const log =
      this.specifics.output === "full"
        ? message.payload
        : message.payload[this.specifics.propertyName ?? ""];

    this.ErrorEvent.trigger({
      id: this.id,
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack,
      exception: this.specifics.exception,
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default ErrorNode;
