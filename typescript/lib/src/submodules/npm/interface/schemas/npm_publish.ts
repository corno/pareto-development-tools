
import type * as s_epe from "./execute_sandboxed_command_executable.js"
import type * as s_path from "./fs_unrestricted_path.js"

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
