import * as p_ from 'pareto-core/interface/data'

import * as d_terminal_output from "pareto-resources/interface/generated/liana/schemas/terminal_output/data"

import * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Parameters = {
    'path': p_.Optional_Value<d_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': d_terminal_output.Message
    }]
    | ['unexpected output', d_terminal_output.Message]
