import * as p_ from 'pareto-core/interface/data'

import * as d_read_directory from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_read_directory/data"
import * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"
import * as d_deseralize_package_json from "../../modules/npm/interface/data/deserialize_package_json.js"
import * as d_npm_package from "../../modules/npm/interface/data/npm_package.js"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Result = {
    'packages': p_.Dictionary<d_npm_package.NPM_Package>
}

export type Package_Error =
    | ['not a directory', null]
    | ['no package.json file', null]
    | ['parse error', d_deseralize_package_json.Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
