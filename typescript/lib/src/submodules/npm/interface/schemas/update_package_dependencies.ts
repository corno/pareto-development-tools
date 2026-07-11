
import type * as s_update2latest from "./update2latest.js"

import type * as s_remove from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_remove"
import type * as s_npm from "./npm_tool.js"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['could not remove node_modules', s_remove.Error]
    | ['could not remove package-lock.json', s_remove.Error]
    | ['could not update to latest', s_update2latest.Error]
    | ['could not install dependencies', s_npm.Error]
