import * as p_ from 'pareto-core/interface/schema'

import type * as s_path from "./fs_unrestricted_path.js"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
}

export type Result = boolean

export type Error =
    | ['could not run git command', {
        'message': {
            'lines': p_.List<string>
        }
    }]
    | ['unexpected output', {
        'message': {
            'lines': p_.List<string>
        }
    }]
