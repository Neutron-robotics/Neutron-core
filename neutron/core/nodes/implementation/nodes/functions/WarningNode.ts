import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

export interface IWarningEvent {
  id: string;
  log: string;
  closeAuto: boolean;
  ack: boolean;
}

export interface WarningNodeSpecifics {
  output: "full" | "property";
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
}

class WarningNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "warning";
  public WarningEvent: ILiteEvent<IWarningEvent>;
  public specifics: WarningNodeSpecifics;

  constructor(builder: INodeBuilder<WarningNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
    this.WarningEvent = new LiteEvent<IWarningEvent>();
  }

  protected process = async (message: NodeMessage) => {
    const log =
      this.specifics.output === "full"
        ? message.payload
        : message.payload[this.specifics.propertyName ?? ""];

    this.WarningEvent.trigger({
      id: this.id,
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack,
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default WarningNode;
