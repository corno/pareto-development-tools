import * as p_ from 'pareto-core/dist/implementation/refiner'
import * as p_i from 'pareto-core/dist/interface/refiner'
import p_iterate from 'pareto-core/dist/implementation/refiner/specials/iterate'

import * as d_out from "../../../../interface/data/execute_command"
import * as d_function from "../../../../interface/data/parse"
import * as d_in from "pareto-resources/dist/interface/data/temp_main"

import * as pr_from_text from "../../productions/execute_command/text"


export const Command: p_i.Refiner<
    d_out.Parameters, d_function.Error, d_in.Parameters
> = ($, abort) => p_iterate<string, d_function.Error, null, d_out.Parameters>(
    $.arguments,
    null,
    p_.literal.set(['too many arguments', null]),
    abort,
    ($iter) => pr_from_text.Command(
        $iter,
    )
)