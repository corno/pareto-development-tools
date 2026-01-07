import * as _pi from 'pareto-core-interface'

// import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_push from "../../modules/git/interface/to_be_generated/push"
import * as d_git_aic from "../../modules/git/interface/to_be_generated/assert_is_clean"
import * as d_git_make_pristine from "../../modules/git/interface/to_be_generated/make_pristine"
import * as d_update_package_dependencies from "./update_package_dependencies"

export type Parameters = {
    'generation':
    | ['minor', null]
    | ['patch', null]
    'path to package': d_path.Context_Path
}

export type Error =
    | ['error while running git push', d_push.Error]
    | ['error while running git assert is clean at the start', d_git_aic.Error]
    | ['error while running git make pristine', d_git_make_pristine.Error]
    | ['error while running update package dependencies', d_update_package_dependencies.Error]
    | ['error while running git assert is clean after updating package dependencies', d_git_aic.Error]
