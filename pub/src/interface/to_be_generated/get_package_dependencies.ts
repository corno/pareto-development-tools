import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import * as d_read_file from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/source"
import * as d_npm from "../../modules/npm/implementation/refiners/schemas/npm_package/temp"


export type Parameters = {
    'path': d_path.Context_Path,
}

export type Result = {
    'packages': _et.Dictionary<d_npm.NPM_Package>
}

export type Package_Error =
    | ['not a directory', null]
    | ['no package.json file', null]
    | ['parse error', d_npm.NPM_Package_Parse_Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', _et.Dictionary<Package_Error>]
