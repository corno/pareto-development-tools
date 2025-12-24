
import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

import * as d_in from "../../../interface/algorithms/queries/package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/pareto/schemas/graphviz/data_types/target"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"
import { $$ as op_filter } from "pareto-standard-operations/dist/implementation/operations/pure/list/filter"

export type Result = _et.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    return {
        'nodes': $.packages.map(($) => null),
        'edges': op_flatten($.packages.deprecated_to_array(() => 1).map(($) => {
            const from = $.key
            return $.value.dependencies.transform(
                ($) => op_filter($.deprecated_to_array(() => 1).map(($) => {
                    if ($.key === "exupery-core-types" || $.key === "exupery-core-alg" || $.key === "exupery-core-dev" || $.key === "exupery-core-data" || $.key === "exupery-core-async" || $.key === "exupery-core-bin") {
                        return _ea.not_set()
                    }
                    return _ea.set(({
                        'from': from,
                        'to': $.key,
                    }))
                })),
                () => _ea.list_literal([])
            )
        }))
    }
}