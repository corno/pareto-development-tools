
import type * as s_epe from "pareto-resources/interface/data/execute_sandboxed_command_executable"
import type * as s_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': s_path.Context_Path,

    'impact':
    | ['dry run', null]
    | ['actual publish', {
        //'one time password': string
    }]
}

export type Error =
    | ['error while running npm', s_epe.Error]
// | ['could not commit', s_eqe.Error]
// | ['could not push', s_eqe.Error]
