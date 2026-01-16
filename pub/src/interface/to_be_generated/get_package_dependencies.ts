import * as _pi from 'pareto-core-interface'

import * as d_read_directory from "pareto-resources/dist/interface/generated/pareto/schemas/read_directory/data"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"
import * as d_deseralize_package_json from "../../modules/npm/interface/to_be_generated/deserialize_package_json"
import * as d_npm_package from "../../modules/npm/interface/to_be_generated/npm_package"

export type Parameters = {
    'path': d_path.Context_Path,
}

export type Result = {
    'packages': _pi.Dictionary<d_npm_package.NPM_Package>
}

export type Package_Error =
    | ['not a directory', null]
    | ['no package.json file', null]
    | ['parse error', d_deseralize_package_json.Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', _pi.Dictionary<Package_Error>]
