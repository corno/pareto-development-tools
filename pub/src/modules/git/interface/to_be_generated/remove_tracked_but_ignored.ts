import * as _pi from 'pareto-core-interface'


import * as d_ece from "pareto-resources/dist/interface/generated/pareto/schemas/execute_command_executable/data"
import * as d_gac from "./assert_is_clean"
import * as d_gic from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['not clean', null]
    | ['could not remove', d_ece.Error]
    | ['could not add', d_ece.Error]
    | ['could not clean', d_ece.Error]
    | ['unexpected error', d_gic.Error]
