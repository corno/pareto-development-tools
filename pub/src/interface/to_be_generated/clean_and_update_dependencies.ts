import * as _et from 'exupery-core-types'

import * as d_update2latest from "../../modules/npm/interface/to_be_generated/update2latest"

import * as d_gc from "../../modules/git/interface/to_be_generated/clean"
import * as d_npm from "../../modules/npm/interface/to_be_generated/npm"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Node_Path,
}

export type Error =
    | ['could not clean', d_gc.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install dependencies', d_npm.Error]
