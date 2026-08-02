import * as p_ from 'pareto-core/interface/schema'

import type * as s_ece from "pareto-resources/schemas/execute_sandboxed_command_executable/schema"
import type * as s_repository_no_open_changes from "../repository_no_open_changes/schema.js"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"

export type Error =
    | ['asserting no open changes', s_repository_no_open_changes.Error]
    | ['could not stage', s_ece.Error]
    | ['could not commit', s_ece.Error]
    | ['could not push', s_ece.Error]


export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'stage all changes': boolean,
    'push after commit': boolean,
}