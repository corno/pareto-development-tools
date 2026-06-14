import * as p_ from 'pareto-core/dist/query'
import * as p_qi from 'pareto-core/dist/query_interface'


import * as signatures from "../../../interface/queries"

//data types
import * as d from "../../../interface/to_be_generated/get_project_files"
import * as d_directory_content from "pareto-resources/dist/interface/to_be_generated/directory_content"


//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import { $$ as q_directory_content } from "pareto-resources/dist/implementation/manual/queries/resources_read_directory_content"

export const $$: signatures.query_functions.get_project_files = p_.query_function(
    ($d, $s, $q) => $q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path to project'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    ).query(
        ($v) => p_.dictionaryx.parallel(
            $v,
            ($): p_qi.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                const path = $.path
                return p_.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'other': return p_.ss($, ($): p_qi.Query_Result<d_directory_content.Directory, d.Package_Error> => p_.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'file': return p_.ss($, ($): p_qi.Query_Result<d_directory_content.Directory, d.Package_Error> => p_.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'directory': return p_.ss($, ($): p_qi.Query_Result<d_directory_content.Directory, d.Package_Error> => q_directory_content(null, $q)(
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