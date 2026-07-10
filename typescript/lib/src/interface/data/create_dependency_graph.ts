
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as d_get_package_dependencies from "./get_package_dependencies.js"

export type Parameters = {
    'path to project': d_path.Context_Path,
}

export type Error =
    | ['package dependencies', d_get_package_dependencies.Error]
    | ['log', null]
