import * as pt from 'pareto-core/dist/query'
import * as pqi from 'pareto-core/dist/query_interface'


import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_project_files"
import * as d_directory_content from "pareto-resources/dist/interface/to_be_generated/directory_content"


//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import { $$ as q_directory_content } from "pareto-resources/dist/implementation/manual/queries/resources_read_directory_content"

export const $$: signatures.queries.get_project_files = pt.query_function(
    ($d, $s, $q) => $q['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($d['path to project'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    ).query(
        ($v) => pt.dictionaryx.parallel(
            $v,
            ($): pqi.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                const path = $.path
                return pt.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'other': return pt.ss($, ($): pqi.Query_Result<d_directory_content.Directory, d.Package_Error> => pt.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'file': return pt.ss($, ($): pqi.Query_Result<d_directory_content.Directory, d.Package_Error> => pt.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'directory': return pt.ss($, ($): pqi.Query_Result<d_directory_content.Directory, d.Package_Error> => q_directory_content(null, $q)(
                            {
                                'path': t_path_to_path.deprecated_node_path_to_context_path(path),
                            },
                            ($): d.Package_Error => ['directory content', $],
                        ))
                        default: return pt.au($[0])
                    }
                })
            },
            ($): d.Error => ['directory content processing', $],
        )
    )
)