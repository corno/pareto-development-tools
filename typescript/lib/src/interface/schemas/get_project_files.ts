import * as p_ from 'pareto-core/interface/schema'

import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_read_directory from "./fs_unrestricted_read_directory.js"
import type * as s_directory_content from "./read_directory_content.js"
import type * as s_project_files from "./project_files.js"

export type Parameters = {
    'path to project': s_path.Context_Path,
}

export type Packages = p_.Dictionary<s_directory_content.Result>

export type Package_Error =
    | ['not a directory', null]
    | ['directory content', s_directory_content.Error]

export type Error =
    | ['read directory', s_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
    | ['log', null]

    
export type Result = s_project_files.Project_Files