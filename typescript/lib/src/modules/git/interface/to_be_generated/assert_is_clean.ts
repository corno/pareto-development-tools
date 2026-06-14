import * as p_di from 'pareto-core/dist/data/interface'

import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_di.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_is_repository_clean.Error]
    | ['working directory is not clean', null]
