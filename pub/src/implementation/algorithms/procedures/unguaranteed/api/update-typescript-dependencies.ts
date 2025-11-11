import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_git_clean } from "./git-clean"
import { $$ as pu_update2latest } from "./update2latest"
import { $$ as pu_npm } from "./npm"

import { $$ as pu_three_steps } from "../../../../../temp/three_steps"

import * as d_npm from "./npm"
import * as d_update_dependencies from "./update2latest"
import * as d_gc from "./git-clean"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update_dependencies.Error]
    | ['could not install', d_npm.Error]

export type Resources = {
    'git procedure': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    'npm procedure': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
    'update2latest': _easync.Unguaranteed_Procedure<d_epe.Parameters, d_epe.Error, null>
}

export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, Resources> = (
    $p, $r,
) => {
    return pu_three_steps(
        pu_git_clean(
            {
                'path': _ea.set($p.path),
            },
            {
                'git procedure': $r['git procedure'],
            },
        ),
        pu_update2latest(
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
            {
                'update2latest': $r['update2latest']
            },
        ),
        pu_npm(
            {
                'path': _ea.set($p.path),
                'operation': ['install', null],
            },
            {
            
                'npm procedure': $r['npm procedure']
            },
        ),
    ).map_error(($) => {
        return _ea.cc($, ($) => {
            switch ($[0]) {
                case 'step1': return _ea.ss($, ($) => {
                    return ['could not clean', $]
                })
                case 'step2': return _ea.ss($, ($) => {
                    return ['could not update to latest', $]
                })
                case 'step3': return _ea.ss($, ($) => {
                    return ['could not install', $]
                })
                default: return _ea.au($[0])
            }
        })
    })
}