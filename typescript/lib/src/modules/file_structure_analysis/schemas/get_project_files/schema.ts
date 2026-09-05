import * as p_ from 'pareto-core/schema'

import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_directory/schema"
import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_project_files from "../project_files/schema.js"

export type Parameters = {
    'path to project': s_path.Context_Path,
}

export type Packages = p_.Dictionary<s_directory_content.Result>


export type Error =
    | ['read directory', s_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
    | ['log', null]

export type Package_Error = s_directory_content.Error

export type Result = s_project_files.Project_Files