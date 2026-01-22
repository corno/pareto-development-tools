import * as _pi from 'pareto-core/dist/interface'

import * as d_utd from "../../modules/npm/interface/to_be_generated/update_package_dependencies"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"


export type Parameters = {
    'path': d_path.Context_Path,
}

export type Error =
    | ['error updating pub', d_utd.Error]
    | ['error updating test', d_utd.Error]
