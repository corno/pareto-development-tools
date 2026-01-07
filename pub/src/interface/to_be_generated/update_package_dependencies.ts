import * as _pi from 'pareto-core-interface'

import * as d_utd from "./update_npm_package_dependencies"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"


export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error updating pub', d_utd.Error]
    | ['error updating test', d_utd.Error]
