import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_interfaces from "../../queries.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

//schemas
import * as d from "../../schemas/get_package_files.js"
import type * as s_directory_content from "../../schemas/nested_directory_content_as_read.js"


//dependencies
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/implementation/queries/read_nested_directory_content"

export const $$: p_.Query_Implementation<
    query_interfaces.get_package_files,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file,
    }
> = p_.query(
    ($d, $s, $q) => q_directory_content(null, $q)(
        {
            'path': $d['path to package'],
        },
        ($): d.Error => ['directory content processing', $],
    )
)