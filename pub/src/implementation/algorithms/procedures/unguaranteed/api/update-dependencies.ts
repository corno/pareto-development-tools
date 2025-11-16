import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_update_typescript_dependencies } from "./update-typescript-dependencies"

import { $$ as pu_two_steps } from "../../../../../temp/procedure/two_steps"

import * as d from "../../../../../interface/temp/update_dependencies"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r,
) => {
    return ($p) => pu_two_steps(
        pu_update_typescript_dependencies($r)(
            {
                'path': `${$p.path}/pub`,
            }
        ),
        pu_update_typescript_dependencies($r)(
            {
                'path': `${$p.path}/test`,
            }
        ),
    ).map_error(($) => _ea.cc($, ($) => {
        switch ($[0]) {
            case 'step1': return _ea.ss($, ($) => {
                return ['error updating pub', $]
            })
            case 'step2': return _ea.ss($, ($) => {
                return ['error updating test', $]
            })
            default: return _ea.au($[0])
        }
    }))
}