import * as _pi from 'pareto-core-interface'

import * as d_eqe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data"
import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

export type Error =
    | ['asserting git not clean', d_is_repository_clean.Error]
    | ['could not stage', d_eqe.Error]
    | ['could not commit', d_eqe.Error]
    | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,
}