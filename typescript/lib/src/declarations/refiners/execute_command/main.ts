
import type * as p_ from 'pareto-core/interface/refiner'

//schemas
import type * as s_out from "../../../interface/schemas/execute_command.js"
import type * as s_in from "../../../interface/schemas/main.js"
import type * as s_error from "../../../interface/schemas/parse.js"

export type Command = p_.Refiner<
    s_out.Parameters,
    s_error.Error,
    s_in.Parameters
>

