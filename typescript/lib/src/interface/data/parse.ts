import * as p_ from 'pareto-core/dist/interface/data'

export type Error =
    | ['expected one of', p_.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]
    | ['too many arguments', null]
