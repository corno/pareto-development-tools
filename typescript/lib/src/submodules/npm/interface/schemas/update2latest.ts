
import type * as s_epe from "./execute_sandboxed_command_executable.js"
import type * as s_path from "./fs_unrestricted_path.js"

export type Parameters = {
    'path': s_path.Context_Path,
    'what':
    | ['dependencies', null]
    | ['dev-dependencies', null],
    'verbose': boolean,
}

export type Error =
    | ['error while running update2latest', s_epe.Error]
// | ['could not commit', s_eqe.Error]
// | ['could not push', s_eqe.Error]

