import * as _pi from 'pareto-core-interface'

export type Error =
    | ['expected one of', _pi.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]
    | ['too many arguments', null]
