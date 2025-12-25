import * as _et from 'exupery-core-types'

export type Error =
    | ['expected one of', _et.Dictionary<null>]
    | ['expected a text', {
        'description': string
    }]
