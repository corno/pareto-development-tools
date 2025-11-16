import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_git_clean } from "./git-clean"
import { $$ as pu_update2latest } from "./update2latest"
import { $$ as pu_npm } from "./npm"

import { $$ as pu_three_steps } from "../../../../../temp/procedure/three_steps"

import * as d from "../../../../../interface/temp/update_typescript_dependencies"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r,
) => {
    return ($p) => pu_three_steps(
        pu_git_clean($r)(
            {
                'path': _ea.set($p.path),
            }
        ),
        pu_update2latest($r)(
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
        ),
        pu_npm($r)(
            {
                'path': _ea.set($p.path),
                'operation': ['install', null],
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