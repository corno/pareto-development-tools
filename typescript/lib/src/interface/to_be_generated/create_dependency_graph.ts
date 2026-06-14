import * as p_di from 'pareto-core/dist/data/interface'

import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"
import * as d_get_package_dependencies from "./get_package_dependencies"

export type Parameters = {
    'path to project': d_path.Context_Path,
}

export type Error =
    | ['package dependencies', d_get_package_dependencies.Error]
    | ['log', null]
