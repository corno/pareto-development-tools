import * as p_ from 'pareto-core/interface/data'

import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as d_read_directory from "pareto-filesystem-unrestricted-api/interface/data/fs_unrestricted_read_directory"
import type * as d_directory_content from "pareto-filesystem-unrestricted-api/interface/data/read_directory_content"
import type * as d_project_files from "./project_files.js"

export type Parameters = {
    'path to project': d_path.Context_Path,
}

export type Packages = p_.Dictionary<d_directory_content.Result>

export type Package_Error =
    | ['not a directory', null]
    | ['directory content', d_directory_content.Error]

export type Error =
    | ['read directory', d_read_directory.Error]
    | ['directory content processing', p_.Dictionary<Package_Error>]
    | ['log', null]

    
export type Result = d_project_files.Project_Files