import * as _pi from 'pareto-core-interface'

import * as d_utd from "./clean_and_update_dependencies"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"


export type Parameters = {
    'path': d_path.Node_Path,
}

export type Error =
    | ['error updating pub', d_utd.Error]
    | ['error updating test', d_utd.Error]
