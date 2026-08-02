
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_get_package_dependencies from "../get_package_dependencies/schema.js"

export type Parameters = {
    'path to project': s_path.Context_Path,
}

export type Error =
    | ['package dependencies', s_get_package_dependencies.Error]
    | ['log', null]
