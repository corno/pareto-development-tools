
import type * as s_read_file from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_file/schema"
import type * as s_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/schema"
import type * as s_deserialize_package_json from "../deserialize_package_json/schema.js"
import type * as s_npm_package from "../npm_package/schema.js"

export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error =
    | readonly ['error while reading package.json', s_read_file.Error]
    | readonly ['error while parsing package.json', s_deserialize_package_json.Error]

export type Result = s_npm_package.NPM_Package