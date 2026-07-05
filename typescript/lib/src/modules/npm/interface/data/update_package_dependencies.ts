
import * as d_update2latest from "./update2latest.js"

import * as d_remove from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_remove/data"
import * as d_npm from "./npm_tool.js"
import * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['could not remove node_modules', d_remove.Error]
    | ['could not remove package-lock.json', d_remove.Error]
    | ['could not update to latest', d_update2latest.Error]
    | ['could not install dependencies', d_npm.Error]
