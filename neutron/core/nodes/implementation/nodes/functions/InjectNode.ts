import BaseNode from '../../../BaseNode';
import {
  IBaseNodeEvent,
  INodeBuilder,
  IRepeatCron,
  IRepeatInterval,
  NeutronPrimitiveType,
  NodeMessage
} from '../../../INeutronNode';
import { NodeInput } from '../../../InputNode';

export interface InjectedField<T> {
  value: T;
  type: NeutronPrimitiveType;
  name: string;
  id: string;
}

export interface InjectNodeSpecifics {
  properties: InjectedField<any>[];
  inject: boolean;
  injectDelay?: number;
  repeat: 'interval' | 'cron' | 'no';
  repeatOptions?: IRepeatCron | IRepeatInterval;
}

class InjectNode extends NodeInput {
  public isInput: boolean = true;

  public readonly type = 'inject';

  private readonly specifics: InjectNodeSpecifics;

  constructor(builder: INodeBuilder<InjectNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (message: NodeMessage) => {
    const injectedProperties = this.specifics.properties.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {}
    );

    return Promise.resolve({
      payload: injectedProperties
    });
  };

  public trigger = async (data: any) => {
    const injectedProperties = this.specifics.properties.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {}
    );
    const event: IBaseNodeEvent = {
      nodeId: this.id,
      data: injectedProperties
    };
    this.ProcessingBegin.trigger(event);
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default InjectNode;
