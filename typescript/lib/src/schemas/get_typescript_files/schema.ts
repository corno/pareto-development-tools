import * as p_ from 'pareto-core/interface/schema'

import type * as s_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_directory/schema"
import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_typescript_cst from "pareto-typescript/schemas/concrete_syntax_tree/schema"
import type * as s_parse_ts from "pareto-typescript/schemas/parse_file/schema"
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

export type Result = Directory

export type Directory = p_.Dictionary<Node>

export type Node = 
    | ['directory', Directory]
    | ['file', File]
    | ['other', null]

export type File = 
| ['success', s_typescript_cst.Source_File]
| ['failure', s_parse_ts.Error]