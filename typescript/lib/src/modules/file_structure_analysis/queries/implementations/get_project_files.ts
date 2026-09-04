import * as p_ from 'pareto-core/implementation/query'

import type * as query_interfaces from "../interfaces.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

//schemas
import * as d from "../../schemas/get_project_files/schema.js"
import type * as s_nested_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/nested_directory_content_as_read/schema"


//dependencies
import * as t_path_to_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/transformers/unrestricted_path"
import { $$ as q_read_nested_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/queries/implementations/read_nested_directory_content"

export const $$: p_.Query_Implementation<
    query_interfaces.get_project_files,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file,
    }
> = p_.query(
    (e, $s, $q) => e.query(
        ($d) => $q['read directory'](
            {
                'path': t_path_to_path.extend_context_path_with_single_step($d['path to project'], { 'addition': "packages" }),
            },
            ($): d.Error => ['read directory', $],
        )
    ).query(
        ($v) => p_.e_deprecated.dictionary(
            $v,
            ($): p_.Query_Result<s_nested_directory_content.Directory, d.Package_Error> => {
                const path = $.path
                return q_read_nested_directory_content(null, $q)(
                    {
                        'path': t_path_to_path.deprecated_node_path_to_context_path(path),
                    },
                    ($): d.Package_Error => $,
                )
            },
            ($): d.Error => ['directory content processing', $],
        )
    )
)