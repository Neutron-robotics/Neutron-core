import BaseNode from "../../../BaseNode";
import {
  INodeBuilder,
  IRepeatCron,
  IRepeatInterval,
  NeutronPrimitiveType,
  NodeMessage,
} from "../../../INeutronNode";

interface InjectedField<T> {
  value: T;
  type: NeutronPrimitiveType;
  name: string;
  id: string;
}

export interface InjectNodeSpecifics {
  properties: InjectedField<any>[];
  inject: boolean;
  injectDelay?: number;
  repeat: "interval" | "cron" | "no";
  repeatOptions?: IRepeatCron | IRepeatInterval;
}

class InjectNode extends BaseNode {
  public isInput: boolean = true;
  public readonly type = "inject";
  private readonly specifics: InjectNodeSpecifics;

  constructor(builder: INodeBuilder<InjectNodeSpecifics>) {
    super(builder);
    this.specifics = builder.specifics;
  }

  protected process = async (_: NodeMessage) => {
    const injectedProperties = this.specifics.properties.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {}
    );

    return {
      payload: injectedProperties,
    };
  };

  protected verifyInput = (_: NodeMessage) => {};
}

export default InjectNode;
