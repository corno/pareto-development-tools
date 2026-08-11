import * as p_ from 'pareto-core/interface/schema'

import type * as s_espe from "pareto-execute-sandboxed/schemas/execute_sandboxed_smelly_command_executable/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"


export type Error =
    | ['error while running tsc', s_espe.Error]
// | ['could not commit', s_eqe.Error]
// | ['could not push', s_eqe.Error]


export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}
