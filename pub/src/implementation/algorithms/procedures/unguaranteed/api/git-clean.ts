import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d from "../../../../../interface/temp/git_clean"

export const $$: _et.Unguaranteed_Procedure<d.Parameters, d.Error, d.Resources> = (
    $r,
) => {
    return ($p) => $r.procedures['git'](
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `-C`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.array_literal([
                    `clean`,
                    `--force`,
                    `-d`, // remove whole directories
                    `-X`, // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                ])
            ])),
        },
    ).map_error(($) => ['unexpected error', $])
}