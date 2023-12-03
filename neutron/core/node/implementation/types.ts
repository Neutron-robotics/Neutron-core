export type NeutronPrimitiveType = 'string' | 'number' | 'bool' | 'json' | 'env' | 'msg'

export interface IRepeatInterval {
    delay: number
}

export interface IRepeatCron {
    expression: string
}