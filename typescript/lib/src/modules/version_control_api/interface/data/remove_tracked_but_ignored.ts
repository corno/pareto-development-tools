import * as p_ from 'pareto-core/dist/interface/data'

//data types
import * as d_ece from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import * as d_gic from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['not clean', null]
    | ['could not remove', d_ece.Error]
    | ['could not add', d_ece.Error]
    | ['could not clean', d_ece.Error]
    | ['unexpected error', d_gic.Error]
