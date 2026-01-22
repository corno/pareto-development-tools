import * as _pi from 'pareto-core/dist/interface'

// import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_command_executable/data"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"
import * as d_push from "../../modules/git/interface/to_be_generated/push"
import * as d_git_aic from "../../modules/git/interface/to_be_generated/assert_is_clean"
import * as d_git_make_pristine from "../../modules/git/interface/to_be_generated/make_pristine"
import * as d_npm from "../../modules/npm/interface/to_be_generated/npm_tool"
import * as d_update_package_dependencies from "./update_package_dependencies"
import * as d_build_and_test from "./build_and_test"

export type Parameters = {
    'path to package': d_path.Context_Path
    'generation':
    | ['minor', null]
    | ['patch', null]
    'impact':
    |['dry run', null]
    |['actual publish', {
        'one time password': string
    }]
}

export type Error =
    | ['error while running git push', d_push.Error]
    | ['error while running git assert is clean at the start', d_git_aic.Error]
    | ['error while running git make pristine', d_git_make_pristine.Error]
    | ['error while running update package dependencies', d_update_package_dependencies.Error]
    | ['error while running build and test', d_build_and_test.Error]
    | ['error while running git assert is clean after updating package dependencies', d_git_aic.Error]
    | ['error while running npm version', d_npm.Error]
    | ['error while running npm publish', d_npm.Error]
