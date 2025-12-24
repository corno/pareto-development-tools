import * as _et from 'exupery-core-types'

import * as d_update2latest from "../../../modules/npm/interface/algorithms/commands/update2latest"

import * as d_gc from "../../../modules/git/interface/algorithms/commands/clean"
import * as d_npm from "../../../modules/npm/interface/algorithms/commands/npm"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Node_Path,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install dependencies', d_npm.Error]

export type Query_Resources = null

export type Command_Resources = {
        'git clean': _et.Command<d_gc.Error, d_gc.Parameters>
        'update2latest': _et.Command<d_update2latest.Error, d_update2latest.Parameters>
        'npm': _et.Command<d_npm.Error, d_npm.Parameters>
}

export type Procedure =  _et.Command_Procedure<_et.Command<Error, Parameters>, Command_Resources, Query_Resources>