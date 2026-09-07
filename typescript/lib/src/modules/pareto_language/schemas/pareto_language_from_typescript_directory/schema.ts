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
| ['source file', {
    'file location': Location
    'error': Source_File_Error
}]

export type Source_File_Error = 
| ['unexpected construct', {
    'name': string
    'location': s_cst.Node['location']
}]
| ['missing construct', {
    'location': s_cst.Node['location']
}]
| ['composed', p_.List<Source_File_Error>]

export type Location = {
    'internal path': string
    'name': string
}
