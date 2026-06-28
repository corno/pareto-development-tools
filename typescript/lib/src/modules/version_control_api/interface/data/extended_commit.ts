import * as p_ from 'pareto-core/dist/interface/data'

import * as d_ece from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import * as d_is_repository_clean from "./is_repository_clean"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Error =
    | ['asserting git not clean', d_is_repository_clean.Error]
    | ['could not stage', d_ece.Error]
    | ['could not commit', d_ece.Error]
    | ['could not push', d_ece.Error]


export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,
}