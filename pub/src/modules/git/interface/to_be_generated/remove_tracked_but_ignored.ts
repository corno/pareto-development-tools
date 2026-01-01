import * as _pi from 'pareto-core-interface'


import * as d_eqe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_gac from "./assert_is_clean"
import * as d_gic from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['not clean', null]
    | ['could not remove', d_eqe.Error]
    | ['could not add', d_eqe.Error]
    | ['could not clean', d_eqe.Error]
    | ['unexpected error', d_gic.Error]
