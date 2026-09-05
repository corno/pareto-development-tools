import * as p_ from 'pareto-core/schema'

import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_typescript_directory from "../typescript_directory/schema.js"

// import type * as s_project_files from "../project_files/schema.js"

export type Parameters = s_directory_content.Result

export type Packages = p_.Dictionary<s_directory_content.Result>


export type Error = p_.Dictionary<Node_Error>

export type Node_Error = 
    | ['directory', Directory_Error]
    | ['file', File_Error]
    | ['other', null]

export type Package_Error = s_directory_content.Error

export type Directory_Error = p_.Dictionary<Node_Error>

export type File_Error = null

export type Result =  s_typescript_directory.Directory
