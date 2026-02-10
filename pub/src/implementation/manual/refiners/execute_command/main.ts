import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'
import _p_iterate from 'pareto-core/dist/_p_iterate'

import * as d_out from "../../../../interface/to_be_generated/execute_command"
import * as d_function from "../../../../interface/to_be_generated/parse"
import * as d_in from "pareto-resources/dist/interface/to_be_generated/temp_main"

import * as builders from "./text"


export const Command: _pi.Refiner<d_out.Parameters, d_function.Error, d_in.Parameters> = ($, abort) => _p_iterate(
    $.arguments,
    ($iter) => $iter.assert_finished(
        () => builders.Command(
            $iter,
            abort,
        ),
        {
            not_finished: ($) => abort(['too many arguments', null]),
        }
    )
)