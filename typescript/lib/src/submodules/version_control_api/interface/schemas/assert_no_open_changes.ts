import * as p_ from 'pareto-core/interface/data'

import type * as s_repository_no_open_changes from "./repository_no_open_changes.js"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Error =
    | ['unexpected error', s_repository_no_open_changes.Error]
    | ['working directory has open changes', null]
