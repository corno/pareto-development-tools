import * as p_ from 'pareto-core/interface/data'

import type * as s_epe from "pareto-resources/interface/data/execute_sandboxed_command_executable"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': p_.Optional_Value<s_path.Context_Path>,
    'operation':
    | ['update', {
        'package-lock only': boolean
    }]
    | ['install', {
        'package-lock only': boolean
    }]
    | ['version', 
        | ['patch', null]
        | ['minor', null]
    ]
}

export type Error =
    | ['error while running npm', s_epe.Error]
// | ['could not commit', s_eqe.Error]
// | ['could not push', s_eqe.Error]
