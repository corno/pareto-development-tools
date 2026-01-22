import * as _p from 'pareto-core/dist/refiner'
import * as _pi from 'pareto-core/dist/interface'

import * as d_result from "../../../../../interface/to_be_generated/execute_command"
import * as d_error from "../../../../../interface/to_be_generated/parse"
import * as d_input from "pareto-resources/dist/interface/to_be_generated/temp_main"

import * as builders from "../productions/text"


export const Command: _pi.Refiner<d_result.Parameters, d_error.Error, d_input.Parameters> = ($, abort) => _p.iterate(
    $.arguments,
    ($iter) => $iter.assert_finished(
        () => builders.Command(
            $iter,
            abort,
        ),
        ($) => abort(['too many arguments', null]),
    )
)