import * as _pi from 'pareto-core/dist/interface'

import * as d_terminal_output from "pareto-resources/dist/interface/generated/liana/schemas/terminal_output/data"

import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"

export type Parameters = {
    'path': _pi.Optional_Value<d_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': d_terminal_output.Message
    }]
    | ['unexpected output', d_terminal_output.Message]
