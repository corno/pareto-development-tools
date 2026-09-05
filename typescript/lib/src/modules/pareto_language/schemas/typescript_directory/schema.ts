import * as p_ from 'pareto-core/schema'

import type * as s_typescript_cst from "pareto-typescript/schemas/concrete_syntax_tree/schema"
import type * as s_parse_ts from "pareto-typescript/schemas/parse_file/schema"

export type Directory = p_.Dictionary<Node>

export type Node = 
    | ['directory', Directory]
    | ['file', File]
    | ['other', null]

export type File = 
| ['success', s_typescript_cst.Source_File]
| ['failure', s_parse_ts.Error]