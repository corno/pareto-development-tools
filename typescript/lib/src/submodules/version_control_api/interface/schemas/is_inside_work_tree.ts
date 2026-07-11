import * as p_ from 'pareto-core/interface/data'

import type * as s_terminal_output from "pareto-resources/interface/data/terminal_output"

import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': s_terminal_output.Message
    }]
    | ['unexpected output', s_terminal_output.Message]
