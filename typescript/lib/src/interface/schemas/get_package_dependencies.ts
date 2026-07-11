import * as p_ from 'pareto-core/interface/data'

import type * as s_read_directory from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_read_directory"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as s_deseralize_package_json from "../../submodules/npm/interface/schemas/deserialize_package_json.js"
import type * as s_npm_package from "../../submodules/npm/interface/schemas/npm_package.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Result = {
    'packages': p_.Dictionary<s_npm_package.NPM_Package>
}

export type Package_Error =
    | ['not a directory', null]
    | ['no package.json file', null]
    | ['parse error', s_deseralize_package_json.Error]

export type Error =
    | ['read directory', s_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
