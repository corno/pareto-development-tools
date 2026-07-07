import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'


import * as interface_ from "../../../interface/queries.js"

//data types
import * as d from "../../../interface/data/get_project_files.js"
import * as d_directory_content from "pareto-filesystem-unrestricted-api/interface/data/directory_content"


//dependencies
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/implementation/manual/queries/resources_read_directory_content"

export const $$: interface_.get_project_files = p_.query(
    ($d, $s, $q) => p_super_query_result($q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path to project'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    )).query(
        ($v) => p_.e.dictionary(
            $v,
            ($)=> {
                const path = $.path
                return p_.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'other': return p_.option($, ($) => p_.e.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'file': return p_.option($, ($) => p_.e.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'directory': return p_.option($, ($) => q_directory_content(null, $q)(
                            {
                                'path': t_path_to_path.deprecated_node_path_to_context_path(path),
                            },
                            ($): d.Package_Error => ['directory content', $],
                        ))
                        default: return p_.au($[0])
                    }
                })
            },
            ($): d.Error => ['directory content processing', $],
        )
    )
)