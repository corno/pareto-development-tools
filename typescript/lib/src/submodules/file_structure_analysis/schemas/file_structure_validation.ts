import * as p_ from 'pareto-core/interface/schema'

import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"

export type Error = 
    | ['directory content processing', s_directory_content.Error]
    | ['log', null]
    | ['file structure problems', p_.List<string>]