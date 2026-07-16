import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_interfaces from "../../interface/queries.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"

//schemas
import * as d from "../../submodules/file_structure_analysis/schemas/get_project_files.js"
import type * as s_directory_content from "../../submodules/file_structure_analysis/schemas/directory_content_as_read.js"


//dependencies
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/implementation/queries/resources_read_directory_content"

export const $$: p_.Query_Implementation<
    query_interfaces.get_project_files,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file,
    }
> = p_.query(
    ($d, $s, $q) => p_super_query_result($q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path to project'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    )).query(
        ($v) => p_.e.dictionary(
            $v,
            ($): p_.Query_Result<s_directory_content.Directory, d.Package_Error> => {
                const path = $.path
                return p_.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'other': return p_.option($, ($) => p_.e.direct_error(['not a directory', null]))
                        case 'file': return p_.option($, ($) => p_.e.direct_error(['not a directory', null]))
                        case 'directory': return p_.option($, ($) => q_directory_content(null, $q)(
                            {
                                'path': t_path_to_path.deprecated_node_path_to_context_path(path),
                            },
                            ($): d.Package_Error => ['directory content', $],
                        ))
                        default: return p_.exhaustive($[0])
                    }
                })
            },
            ($): d.Error => ['directory content processing', $],
        )
    )
)