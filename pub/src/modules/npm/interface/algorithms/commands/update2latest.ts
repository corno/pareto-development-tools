import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Node_Path,
    'what':
    | ['dependencies', null]
    | ['dev-dependencies', null],
    'verbose': boolean,
}

export type Error =
    | ['error while running update2latest', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]

export type Query_Resources = null

export type Command_Resources = {
    'update2latest': _et.Command<d_epe.Error, d_epe.Parameters>
}

export type Procedure = _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>