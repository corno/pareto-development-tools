import * as _et from 'exupery-core-types'

import * as d_log from "../../../modules/pareto-fountain-pen-directory/implementation/commands/console_log"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_package_dependencies from "../queries/package_dependencies"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['package dependencies', d_package_dependencies.Error]
    | ['log', null]


export type Query_Resources = {
    'package dependencies': d_package_dependencies.Query
}

export type Command_Resources = {
    'log': _et.Command<null, d_log.Parameters>
}

export type Signature = _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>