import * as p_ from 'pareto-core/interface/schema'

import type * as s_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_directory/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_deseralize_package_json from "../../../npm/schemas/deserialize_package_json/schema.js"
import type * as s_package_dependencies from "../package_dependencies/schema.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Result = s_package_dependencies.Package_Dependencies

export type Package_Error =
    | ['not a directory', null]
    | ['no package.json file', null]
    | ['parse error', s_deseralize_package_json.Error]

export type Error =
    | ['read directory', s_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
