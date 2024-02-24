import { ILiteEvent, LiteEvent } from '../../../../../utils/LiteEvent';
import { BaseNode } from '../../../BaseNode';
import { INodeBuilder, NodeMessage } from '../../../INeutronNode';

export interface IInfoEvent {
  id: string;
  log: string;
  closeAuto: boolean;
  ack: boolean;
}

export interface InfoNodeSpecifics {
  output: 'full' | 'property';
  propertyName?: string;
  closeAuto: boolean;
  ack: boolean;
}

export class InfoNode extends BaseNode {
  public isInput: boolean = false;

  public readonly type = 'info';

  public InfoEvent: ILiteEvent<IInfoEvent>;

  public specifics: InfoNodeSpecifics;

  constructor(builder: INodeBuilder<InfoNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
    this.InfoEvent = new LiteEvent<IInfoEvent>();
  }

  protected process = async (message: NodeMessage) => {
    const log = this.specifics.output === 'full'
      ? message.payload.toString()
      : message.payload[this.specifics.propertyName ?? ''].toString();

    this.InfoEvent.trigger({
      id: this.id,
      log,
      closeAuto: this.specifics.closeAuto,
      ack: this.specifics.ack
    });
    return Promise.resolve({ payload: undefined });
  };

  protected verifyInput = (_: NodeMessage) => {};
}
