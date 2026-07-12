// import type * as s_epe from "./execute_sandboxed_command_executable.js"
import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_push from "../../submodules/version_control_api/interface/schemas/push.js"
import type * as s_git_aic from "../../submodules/version_control_api/interface/schemas/assert_no_open_changes.js"
import type * as s_git_make_pristine from "../../submodules/version_control_api/interface/schemas/make_pristine.js"
import type * as s_npm from "../../submodules/npm/interface/schemas/npm_tool.js"
import type * as s_update_package_dependencies from "./update_package_dependencies.js"
import type * as s_build_and_test from "./build_and_test.js"
import type * as s_get_package_json from "../../submodules/npm/interface/schemas/get_package_json.js"
import type * as s_git_ec from "../../submodules/version_control_api/interface/schemas/extended_commit.js"

export type Parameters = {
    'path to package': s_path.Context_Path
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
    | ['error while running git push', s_push.Error]
    | ['error while running git assert no open changes at the start', s_git_aic.Error]
    | ['error while running git make pristine', s_git_make_pristine.Error]
    | ['error while running update package dependencies', s_update_package_dependencies.Error]
    | ['error while running build and test', s_build_and_test.Error]
    | ['error while running git assert no open changes after updating package dependencies', s_git_aic.Error]
    | ['error while running npm version', s_npm.Error]
    | ['error while running npm update', s_npm.Error]
    | ['error while running npm publish', s_npm.Error]
    | ['error while getting package.json', s_get_package_json.Error]
    | ['error while logging', null]
    | ['error while running git extended commit', s_git_ec.Error]
