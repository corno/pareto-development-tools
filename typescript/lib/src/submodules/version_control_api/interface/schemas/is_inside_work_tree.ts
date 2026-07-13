import * as p_ from 'pareto-core/interface/schema'

import type * as s_terminal_output from "./terminal_output.js"

import type * as s_path from "./fs_unrestricted_path.js"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': s_terminal_output.Message
    }]
    | ['unexpected output', s_terminal_output.Message]
