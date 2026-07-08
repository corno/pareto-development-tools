import * as p_ from 'pareto-core/interface/data'

import type * as d_ece from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import type * as d_repository_no_open_changes from "./repository_no_open_changes.js"
import type * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Error =
    | ['asserting no open changes', d_repository_no_open_changes.Error]
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