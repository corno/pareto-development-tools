import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../../interface/temp/build_and_test"

import { $$ as pu_build } from "./build"
import { $$ as pu_two_steps } from "../../../../../temp/procedure/two_steps"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r
) => {
    return ($p) => _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {
            pu_two_steps(
                // Step 1: clean the /dest directory?
                pu_build($r)(
                    {
                        'path': $p.path,
                    },
                ),
                $r.procedures.node(
                    {
                        'args': _ea.array_literal([
                            $p.path + `/test/dist/bin/test.js`,
                        ])
                    },
                ),
            ).__start(
                on_success,
                ($) => {
                    _ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'step1': return _ea.ss($, ($) => {
                                on_exception(['error building', $])
                            })
                            case 'step2': return _ea.ss($, ($) => {
                                on_exception(['error testing', $])
                            })
                            default: return _ea.au($[0])
                        }
                    })
                },
            )
        }
    })
}