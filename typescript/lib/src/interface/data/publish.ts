// import type * as d_epe from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import type * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"
import type * as d_push from "../../modules/version_control_api/interface/data/push.js"
import type * as d_git_aic from "../../modules/version_control_api/interface/data/assert_no_open_changes.js"
import type * as d_git_make_pristine from "../../modules/version_control_api/interface/data/make_pristine.js"
import type * as d_npm from "../../modules/npm/interface/data/npm_tool.js"
import type * as d_update_package_dependencies from "./update_package_dependencies.js"
import type * as d_build_and_test from "./build_and_test.js"
import type * as d_get_package_json from "../../modules/npm/interface/data/get_package_json.js"
import type * as d_git_ec from "../../modules/version_control_api/interface/data/extended_commit.js"

export type Parameters = {
    'path to package': d_path.Context_Path
    'generation':
    | ['minor', null]
    | ['patch', null]
    'impact':
    |['dry run', null]
    |['actual publish', {
        //'one time password': string
    }]
}

export type Error =
    | ['error while running git push', d_push.Error]
    | ['error while running git assert no open changes at the start', d_git_aic.Error]
    | ['error while running git make pristine', d_git_make_pristine.Error]
    | ['error while running update package dependencies', d_update_package_dependencies.Error]
    | ['error while running build and test', d_build_and_test.Error]
    | ['error while running git assert no open changes after updating package dependencies', d_git_aic.Error]
    | ['error while running npm version', d_npm.Error]
    | ['error while running npm update', d_npm.Error]
    | ['error while running npm publish', d_npm.Error]
    | ['error while getting package.json', d_get_package_json.Error]
    | ['error while logging', null]
    | ['error while running git extended commit', d_git_ec.Error]
