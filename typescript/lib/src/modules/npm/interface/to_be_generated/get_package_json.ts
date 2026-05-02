import * as _pi from 'pareto-core/dist/interface'

import * as d_read_file from "pareto-resources/dist/interface/generated/liana/schemas/read_file/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"
import * as d_deserialize_package_json from "./deserialize_package_json"
import * as d_npm_package from "./npm_package"

export type Parameters = {
    'path to package': d_path.Context_Path,
}

export type Error =
    | readonly ['error while reading package.json', d_read_file.Error]
    | readonly ['error while parsing package.json', d_deserialize_package_json.Error]

export type Result = d_npm_package.NPM_Package