import * as _pi from 'pareto-core/dist/interface'

import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_command_executable/data"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

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

