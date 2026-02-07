import * as _pi from 'pareto-core/dist/interface'

import * as d_ece from "pareto-resources/dist/interface/generated/liana/schemas/execute_command_executable/data"
import * as d_eqe from "pareto-resources/dist/interface/generated/liana/schemas/execute_query_executable/data"
import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"

export type Error =
    | ['asserting git not clean', d_is_repository_clean.Error]
    | ['could not stage', d_ece.Error]
    | ['could not commit', d_ece.Error]
    | ['could not push', d_ece.Error]


export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,
}