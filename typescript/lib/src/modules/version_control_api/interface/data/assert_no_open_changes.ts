import * as p_ from 'pareto-core/dist/interface/data'

import * as d_repository_no_open_changes from "./repository_no_open_changes"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_repository_no_open_changes.Error]
    | ['working directory has open changes', null]
