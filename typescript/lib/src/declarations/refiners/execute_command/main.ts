
import type * as p_ from 'pareto-core/interface/refiner'

import type * as s_out from "../../../interface/schemas/execute_command.js"
import type * as s_function from "../../../interface/schemas/parse.js"
import type * as s_in from "pareto-application-api/interface/data/main"

export type Command = p_.Refiner<
    s_out.Parameters,
    s_function.Error,
    s_in.Parameters
>

