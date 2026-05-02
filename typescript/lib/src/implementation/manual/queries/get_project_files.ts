import * as _p from 'pareto-core/dist/query'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_project_files"
import * as d_directory_content from "pareto-resources/dist/interface/to_be_generated/directory_content"


//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/path/path"
import { $$ as q_directory_content } from "pareto-resources/dist/implementation/manual/queries/read_directory_content"

export const $$: signatures.queries.get_project_files = _p.query_function(
    ($p, $r) => $r['read directory'](
        {
            'path': t_path_to_path.extend_context_path_with_single_step($p['path to project'], { 'addition': "packages" }),
        },
        ($): d.Error => ['read directory', $],
    ).query(
        ($v) => _p.dictionaryx.parallel(
            $v.__d_map(($): _p.Query_Result<d_directory_content.Directory, d.Package_Error> => {
                const path = $.path
                return _p.decide.state($['node type'], ($) => {
                    switch ($[0]) {
                        case 'other': return _p.ss($, ($): _p.Query_Result<d_directory_content.Directory, d.Package_Error> => _p.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'file': return _p.ss($, ($): _p.Query_Result<d_directory_content.Directory, d.Package_Error> => _p.direct_error<d_directory_content.Directory, d.Package_Error>(['not a directory', null]))
                        case 'directory': return _p.ss($, ($): _p.Query_Result<d_directory_content.Directory, d.Package_Error> => q_directory_content($r)(
                            {
                                'path': t_path_to_path.deprecated_node_path_to_context_path(path),
                            },
                            ($): d.Package_Error => ['directory content', $],
                        ))
                        default: return _p.au($[0])
                    }
                })
            }),
            ($): d.Error => ['directory content processing', $],
        )
    )
)