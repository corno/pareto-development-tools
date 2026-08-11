import * as p_ from 'pareto-core/interface/schema'

import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_ust from "pareto-untyped-syntax-tree-api/schemas/parse_file/schema"
import type * as s_ts from "pareto-typescript/schemas/concrete_syntax_tree_from_untyped_syntax_tree/schema"


export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error =
    | ['node analysis', p_.Dictionary<Node_Error>]
    | ['directory content processing', s_directory_content.Error]
    // | ['log', null]
    | ['file structure problems', p_.Dictionary<p_.List<string>>]

export type Node_Error =
| ['typescript parse error', s_ts.Error]