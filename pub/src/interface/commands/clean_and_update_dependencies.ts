import * as _et from 'exupery-core-types'

import * as d_update2latest from "../../modules/npm/interface/commands/update2latest"

import * as d_gc from "../../modules/git/interface/commands/clean"
import * as d_npm from "../../modules/npm/interface/commands/npm"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install', d_npm.Error]

export type Query_Resources = null

export type Command_Resources = {
        'git clean': _et.Command<d_gc.Error, d_gc.Parameters>
        'update2latest': _et.Command<d_update2latest.Error, d_update2latest.Parameters>
        'npm': _et.Command<d_npm.Error, d_npm.Parameters>
}

export type Procedure =  _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>