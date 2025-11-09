import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as pu_epe } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_procedure_executable"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Error =
    | ['unexpected error', d_epe.Error]

export const $$: _easync.Unguaranteed_Procedure<Parameters, Error, null> = (
    $p,
) => {
    return pu_epe(
        {
            'program': `git`,
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
        null,
    ).map_error(($) => ['unexpected error', $])
}