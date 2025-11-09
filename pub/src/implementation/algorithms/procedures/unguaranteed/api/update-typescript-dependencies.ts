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

export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update_dependencies.Error]
    | ['could not install', d_npm.Error]

export type Resources = null

export const $$: _easync.Unguaranteed_Procedure_Initializer<Parameters, Error, Resources> = (
    $p,
) => {
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            pu_three_steps(
                pu_git_clean(
                    {
                        'path': _ea.set($p.path),
                    },
                    null,
                ),
                pu_update2latest(
                    {
                        'path': $p.path,
                        'verbose': false,
                        'what': ['dependencies', null],
                    },
                    null,
                ),
                pu_npm(
                    {
                        'path': _ea.set($p.path),
                        'operation': ['install', null],
                    },
                    null,
                ),
            ).__start(
                on_success,
                ($) => {
                    _ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'step1': return _ea.ss($, ($) => {
                                on_exception(['could not clean', $])
                            })
                            case 'step2': return _ea.ss($, ($) => {
                                on_exception(['could not update to latest', $])
                            })
                            case 'step3': return _ea.ss($, ($) => {
                                on_exception(['could not install', $])
                            })
                            default: return _ea.au($[0])
                        }
                    })
                },
            )
        }
    })
}