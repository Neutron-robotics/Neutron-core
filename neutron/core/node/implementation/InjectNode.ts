import { INodeBuilder } from "../NeutronGraphNode";
import BaseNode, { NodeMessage } from "./BaseNode";
import { IRepeatCron, IRepeatInterval, NeutronPrimitiveType } from "./types";

interface InjectedField<T> {
    value: T,
    type: NeutronPrimitiveType
    name: string
    id: string
}

export interface InjectNodeSpecifics {
    properties: InjectedField<any>[]
    inject: boolean
    injectDelay?: number
    repeat: 'interval' | 'cron' | 'no'
    repeatOptions?: IRepeatCron | IRepeatInterval
}

class InjectNode extends BaseNode {
    public readonly type = 'inject'
    private readonly specifics: InjectNodeSpecifics

    constructor(builder: INodeBuilder<InjectNodeSpecifics>) {
        super(builder)
        this.specifics = builder.specifics
    }

    protected process = async (payload: NodeMessage) => {
        
    }

    protected beforeProcess = async (payload: NodeMessage) => {

    }
}