
import type * as d_epe from "pareto-resources/interface/data/execute_sandboxed_command_executable"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"

export type Parameters = {
    'path': d_path.Context_Path,
    'what':
    | ['dependencies', null]
    | ['dev-dependencies', null],
    'verbose': boolean,
}

export type Error =
    | ['error while running update2latest', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]

