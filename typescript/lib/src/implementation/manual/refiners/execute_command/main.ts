import * as p_i from 'pareto-core/interface/refiner'
import p_iterate from 'pareto-core/implementation/refiner/specials/iterate'

import * as d_out from "../../../../interface/data/execute_command.js"
import * as d_function from "../../../../interface/data/parse.js"
import * as d_in from "pareto-resources/interface/data/temp_main"

import * as pr_from_text from "../../productions/execute_command/text.js"


export const Command: p_i.Refiner<
    d_out.Parameters,
    d_function.Error,
    d_in.Parameters
> = ($, abort) => p_iterate<
    d_out.Parameters,
    string,
    null
>({

    list: $.arguments,
    end_info: null,
    assign: (iterator) => pr_from_text.Command(
        iterator,
        abort,
    ),
    on_dangling_item: () => abort(['too many arguments', null]),
})