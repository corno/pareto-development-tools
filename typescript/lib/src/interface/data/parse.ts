import * as p_di from 'pareto-core/dist/interface/data'

export type Error =
    | ['expected one of', p_di.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]
    | ['too many arguments', null]
