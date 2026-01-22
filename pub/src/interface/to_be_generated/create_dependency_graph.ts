import * as _pi from 'pareto-core/dist/interface'

import * as d_log from "../../modules/pareto-fountain-pen-directory/implementation/manual/commands/console_log"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"
import * as d_get_package_dependencies from "./get_package_dependencies"

export type Parameters = {
    'path to project': d_path.Context_Path,
}

export type Error =
    | ['package dependencies', d_get_package_dependencies.Error]
    | ['log', null]
