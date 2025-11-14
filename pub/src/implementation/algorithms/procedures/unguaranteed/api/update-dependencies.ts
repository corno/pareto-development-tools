import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_update_typescript_dependencies } from "./update-typescript-dependencies"

import { $$ as pu_two_steps } from "../../../../../temp/two_steps"

import * as d_utd from "./update-typescript-dependencies"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['error building pub', d_utd.Error]
    | ['error building test', d_utd.Error]

export type Resources = {
    'git procedure': _et.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    'npm procedure': _et.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    'update2latest': _et.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
}

export const $$: _et.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $p, $r,
) => {
    return pu_two_steps(
        pu_update_typescript_dependencies(
            {
                'path': `${$p.path}/pub`,
            },
            {
                'git procedure': $r['git procedure'],
                'npm procedure': $r['npm procedure'],
                'update2latest': $r.update2latest,
            },
        ),
        pu_update_typescript_dependencies(
            {
                'path': `${$p.path}/test`,
            },
            {
                'git procedure': $r['git procedure'],
                'npm procedure': $r['npm procedure'],
                'update2latest': $r.update2latest,
            },
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