import * as p_ from 'pareto-core/interface/data'

export type Error =
    | ['expected one of', Expected]
    | ['expected a text', {
        'description': string
    }]
    | ['too many arguments', null]

export type Expected = p_.Dictionary<null>