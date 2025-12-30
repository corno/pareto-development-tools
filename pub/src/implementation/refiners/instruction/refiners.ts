import * as _pr from 'pareto-core-refiner'
import * as _pi from 'pareto-core-interface'

import * as d from "../../../interface/to_be_generated/api"
import * as d_error from "../../../interface/to_be_generated/parse"
import * as d_main from "exupery-resources/dist/interface/to_be_generated/temp_main"

import * as builders from "./builders"


export const Command: _pi.Refiner<d.Parameters, d_error.Error, d_main.Parameters> = ($, abort) => {
    return builders.Command(
        _pr.create_iterator($.arguments),
        abort,
    )
}