import * as p_ from 'pareto-core/interface/schema'

import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_ust from "pareto-untyped-syntax-tree-api/schemas/parse_file/schema"
import type * as s_ts from "pareto-typescript/schemas/concrete_syntax_tree_from_untyped_syntax_tree/schema"
import type * as s_get_typescript_files from "../get_typescript_files/schema.js"
import type * as s_log from "pareto-stream-api/schemas/log_lines/schema"
    

export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error =
    | ['log', s_log.Error]
    | ['typescript parsing', s_get_typescript_files.Error]
    | ['pareto parsing', Pareto_Parsing_Error]
    | ['node analysis', p_.Dictionary<Node_Error>]
    | ['directory content processing', s_directory_content.Error]
    // | ['log', null]
    | ['file structure problems', p_.Dictionary<p_.List<string>>]

export type Node_Error =
| ['typescript parse error', s_ts.Error]

export type Pareto_Parsing_Error = 
| ['no such node', {
    'context path': s_path.Context_Path
    'internal path': string
    'name': string
}]
| ['not a directory', {
    'context path': s_path.Context_Path
    'internal path': string
    'name': string
}]
| ['not a file', {
    'context path': s_path.Context_Path
    'internal path': string
    'name': string
}]