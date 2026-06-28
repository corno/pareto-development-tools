import * as p_ from 'pareto-core/dist/interface/data'

import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_is_repository_clean.Error]
    | ['working directory is not clean', null]
