
import type * as p_ from 'pareto-core/interface/refiner'

import type * as d_out from "../../../interface/schemas/execute_command.js"
import type * as d_function from "../../../interface/schemas/parse.js"
import type * as d_in from "pareto-application-api/interface/data/main"

export type Command = p_.Refiner<
    d_out.Parameters,
    d_function.Error,
    d_in.Parameters
>

