import { ILiteEvent, LiteEvent } from '../../../../../utils/LiteEvent';
import { BaseNode } from '../../../BaseNode';
import { INodeBuilder, NodeMessage } from '../../../INeutronNode';

export interface ISuccessEvent {
  id: string;
  log: string;
  closeAuto: boolean;
  ack: boolean;
}

export interface SuccessNodeSpecifics {
  output: 'full' | 'property';
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
}

export class SuccessNode extends BaseNode {
  public isInput: boolean = false;

  public readonly type = 'success';

  public SuccessEvent: ILiteEvent<ISuccessEvent>;

  public specifics: SuccessNodeSpecifics;

  constructor(builder: INodeBuilder<SuccessNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
    this.SuccessEvent = new LiteEvent<ISuccessEvent>();
  }

  protected process = async (message: NodeMessage) => {
    const log = this.specifics.output === 'full'
      ? message.payload.toString()
      : message.payload[this.specifics.propertyName ?? ''].toString();

    this.SuccessEvent.trigger({
      id: this.id,
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}
