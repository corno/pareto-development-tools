import * as _pi from 'pareto-core-interface'

import * as d_update2latest from "./update2latest"

import * as d_remove from "pareto-resources/dist/interface/generated/pareto/schemas/remove/data_types/target"
import * as d_npm from "./npm"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['could not remove node_modules', d_remove.Error]
    | ['could not remove package-lock.json', d_remove.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install dependencies', d_npm.Error]
