import * as p_ri from 'pareto-core/dist/refiner/interface'
import p_iterate from 'pareto-core/dist/specials/iterate'

import * as d_out from "../../../../interface/to_be_generated/execute_command"
import * as d_function from "../../../../interface/to_be_generated/parse"
import * as d_in from "pareto-resources/dist/interface/to_be_generated/temp_main"

import * as r_from_text from "./text"


export const Command: p_ri.Refiner<d_out.Parameters, d_function.Error, d_in.Parameters> = ($, abort) => p_iterate(
    $.arguments,
    null,
    ($iter) => $iter.assert_finished(
        () => r_from_text.Command(
            $iter,
            abort,
        ),
        {
            not_finished: ($) => abort(['too many arguments', null]),
        }
    )
)