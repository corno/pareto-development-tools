import * as p_ from 'pareto-core/interface/schema'

import type * as s_path from "../../../interface/schemas/fs_unrestricted_path.js"
import type * as s_directory_content from "./read_nested_directory_content.js"

export type Parameters = {
    'path to package': s_path.Context_Path,
}

export type Error = 
    | ['directory content processing', s_directory_content.Error]
    | ['log', null]

export type Result = s_directory_content.Result