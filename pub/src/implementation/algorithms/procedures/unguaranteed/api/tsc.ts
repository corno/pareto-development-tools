import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'
import * as _eb from 'exupery-core-bin'
import * as _ea from 'exupery-core-alg'

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_tsc from "../../../../../interface/temp/tsc"

export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Resources = {
    'procedures': {
        'tsc': _et.Unguaranteed_Procedure<d_espe.Parameters, d_espe.Error, null>
    }
}

export const $$: _et.Unguaranteed_Procedure<Parameters, d_tsc.Error, Resources> = (
    $p, $r,
) => {
    return $r.procedures.tsc(
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `--project`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.array_literal([
                    `--pretty`,
                ]),
            ])),
        },
        null,
    ).map_error(($) => ['error while running tsc', $])
}