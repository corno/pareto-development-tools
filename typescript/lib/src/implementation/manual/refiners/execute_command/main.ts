import * as p_i from 'pareto-core/dist/interface/refiner'
import p_iterate from 'pareto-core/dist/implementation/specials/iterate'

import * as d_out from "../../../../interface/data/execute_command"
import * as d_function from "../../../../interface/data/parse"
import * as d_in from "pareto-resources/dist/interface/to_be_generated/temp_main"

import * as r_from_text from "../../productions/execute_command/text"


export const Command: p_i.Refiner<d_out.Parameters, d_function.Error, d_in.Parameters> = ($, abort) => p_iterate(
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