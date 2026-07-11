
import type * as d_read_file from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_read_file"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as d_deserialize_package_json from "./deserialize_package_json.js"
import type * as d_npm_package from "./npm_package.js"

export type Parameters = {
    'path to package': d_path.Context_Path,
}

export type Error =
    | readonly ['error while reading package.json', d_read_file.Error]
    | readonly ['error while parsing package.json', d_deserialize_package_json.Error]

export type Result = d_npm_package.NPM_Package