import * as _pr from 'pareto-core-refiner'
import * as _pi from 'pareto-core-interface'

import * as d_result from "../../../../../interface/to_be_generated/api"
import * as d_error from "../../../../../interface/to_be_generated/parse"
import * as d_input from "exupery-resources/dist/interface/to_be_generated/temp_main"

import * as builders from "../productions/text"


export const Command: _pi.Refiner<d_result.Parameters, d_error.Error, d_input.Parameters> = ($, abort) => {
    return builders.Command(
        _pr.create_iterator($.arguments),
        abort,
    )
}