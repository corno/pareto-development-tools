import * as p_ from 'pareto-core/interface/schema'

import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"

export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error = 
    | ['directory content processing', s_directory_content.Error]
    | ['log', null]

export type Result = s_directory_content.Result