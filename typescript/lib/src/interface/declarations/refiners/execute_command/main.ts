import * as p_ from 'pareto-core/implementation/refiner'
import type * as p_i from 'pareto-core/interface/refiner'
import p_iterate from 'pareto-core/implementation/refiner/specials/iterate'

import type * as d_out from "../../../data/execute_command.js"
import type * as d_function from "../../../data/parse.js"
import type * as d_in from "pareto-application-api/interface/data/main"
import type * as d_publish from "../../../data/publish.js"

import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

//dependencies
import * as t_context_path_from_text from "pareto-resources/implementation/manual/refiners/path_unrestricted/text"

export namespace interface_ {
    export type Command = p_i.Refiner<
        d_out.Parameters,
        d_function.Error,
        d_in.Parameters
    >
}
