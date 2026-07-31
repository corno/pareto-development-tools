
import type * as s_path from "../../../schemas/fs_unrestricted_path.js"
import type * as s_get_package_dependencies from "./get_package_dependencies.js"

export type Parameters = {
    'path to project': s_path.Context_Path,
}

export type Error =
    | ['package dependencies', s_get_package_dependencies.Error]
    | ['log', null]
