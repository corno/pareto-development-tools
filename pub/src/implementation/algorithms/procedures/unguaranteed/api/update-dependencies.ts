import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_update_typescript_dependencies } from "./update-typescript-dependencies"

import { $$ as pu_two_steps } from "../../../../../temp/two_steps"

import * as d_utd from "./update-typescript-dependencies"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_utd.Error]
    | ['error building test', d_utd.Error]

export type Resources = null

export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $p,
) => {
    return pu_two_steps(
        pu_update_typescript_dependencies(
            {
                'path': `${$p.path}/pub`,
            },
            null,
        ),
        pu_update_typescript_dependencies(
            {
                'path': `${$p.path}/test`,
            },
            null,
        ),
    ).map_error(($) => _ea.cc($, ($) => {
        switch ($[0]) {
            case 'step1': return _ea.ss($, ($) => {
                return ['error building pub', $]
            })
            case 'step2': return _ea.ss($, ($) => {
                return ['error building test', $]
            })
            default: return _ea.au($[0])
        }
    }))
}