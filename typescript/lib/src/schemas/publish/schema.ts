// import type * as s_epe from "../execute_sandboxed_command_executable/schema.js"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_push from "../../modules/version_control_api/schemas/push/schema.js"
import type * as s_git_aic from "../../modules/version_control_api/schemas/assert_no_open_changes/schema.js"
import type * as s_git_make_pristine from "../../modules/version_control_api/schemas/make_pristine/schema.js"
import type * as s_npm from "../../modules/npm/schemas/npm_tool/schema.js"
import type * as s_update_package_dependencies from "../update_package_dependencies/schema.js"
import type * as s_build_and_validate from "../build_and_validate/schema.js"
import type * as s_get_package_json from "../../modules/npm/schemas/get_package_json/schema.js"
import type * as s_git_ec from "../../modules/version_control_api/schemas/extended_commit/schema.js"

export type Parameters = {
    'path to package': s_path.Context_Path
    'parameters 2': Parameters2
}

export type Parameters2 = {
    'generation': Parameters2.generation
    'impact': Parameters2.impact
}

export namespace Parameters2 {
    export type generation =
        | ['minor', null]
        | ['patch', null]
    export type impact =
        | ['dry run', null]
        | ['actual publish', {
            //'one time password': string
        }]
}

export type Error =
    | ['error while running git push', s_push.Error]
    | ['error while running git assert no open changes at the start', s_git_aic.Error]
    | ['error while running git make pristine', s_git_make_pristine.Error]
    | ['error while running update package dependencies', s_update_package_dependencies.Error]
    | ['error while running build and validate', s_build_and_validate.Error]
    | ['error while running git assert no open changes after updating package dependencies', s_git_aic.Error]
    | ['error while running npm version', s_npm.Error]
    | ['error while running npm update', s_npm.Error]
    | ['error while running npm publish', s_npm.Error]
    | ['error while getting package.json', s_get_package_json.Error]
    | ['error while logging', null]
    | ['error while running git extended commit', s_git_ec.Error]
