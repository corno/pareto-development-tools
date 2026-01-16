import * as _pi from 'pareto-core-interface'

import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Error =
    | ['unexpected error', d_is_repository_clean.Error]
    | ['working directory is not clean', null]
