
import type * as s_epe from "./execute_sandboxed_command_executable.js"
import type * as s_build from "./build.js"
import type * as s_path from "./fs_unrestricted_path.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['error building', s_build.Error]
    | ['error testing', s_epe.Error]
