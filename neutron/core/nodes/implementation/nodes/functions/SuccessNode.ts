import { ILiteEvent, LiteEvent } from "../../../../../utils/LiteEvent";
import BaseNode from "../../../BaseNode";
import { INodeBuilder, NodeMessage } from "../../../INeutronNode";

export interface ISuccessEvent {
  log: string;
  closeAuto: boolean;
  ack: boolean;
}

export interface SuccessNodeSpecifics {
  output: "full" | "property";
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
}

class SuccessNode extends BaseNode {
  public isInput: boolean = false;
  public readonly type = "success";
  public SuccessEvent: ILiteEvent<ISuccessEvent>;
  public specifics: SuccessNodeSpecifics;

  constructor(builder: INodeBuilder<SuccessNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
    this.SuccessEvent = new LiteEvent<ISuccessEvent>();
  }

  protected process = async (message: NodeMessage) => {
    const log =
      this.specifics.output === "full"
        ? message.payload
        : message.payload[this.specifics.propertyName ?? ""];

    this.SuccessEvent.trigger({
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack,
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default SuccessNode;
