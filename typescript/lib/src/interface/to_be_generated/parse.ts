import * as pi from 'pareto-core/dist/interface'

export type Error =
    | ['expected one of', pi.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]
    | ['too many arguments', null]
