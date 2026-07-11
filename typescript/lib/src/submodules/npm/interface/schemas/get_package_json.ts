
import type * as s_read_file from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_read_file"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as s_deserialize_package_json from "./deserialize_package_json.js"
import type * as s_npm_package from "./npm_package.js"

export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error =
    | readonly ['error while reading package.json', s_read_file.Error]
    | readonly ['error while parsing package.json', s_deserialize_package_json.Error]

export type Result = s_npm_package.NPM_Package