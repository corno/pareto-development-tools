import type * as p_ from 'pareto-core/schema'

import type * as s_cst from "pareto-untyped-syntax-tree-api/schemas/untyped_syntax_tree/schema"


export type Error = 
| ['typescript parsing failed', {
    'location': Location
}]
| ['aggregated', {
    'errors': p_.List<Error>
}]
| ['no such node', Location]
| ['not a directory', Location]
| ['not a file', Location]
| ['unexpected construct', {
    'file location': Location
    'error': Unexpected_Construct_Error
}]

export type Unexpected_Construct_Error = {
    'name': string
    'location': s_cst.Node['location']
}

export type Location = {
    'internal path': string
    'name': string
}
