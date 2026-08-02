
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_git_extended_commit from "../../modules/version_control_api/schemas/extended_commit/schema.js"
import type * as s_build_and_validate from "../build_and_validate/schema.js"

export type Error =
    | ['version control extended commit', s_git_extended_commit.Error]
    | ['error while running build and validate', s_build_and_validate.Error]


export type Parameters = {
    'path': s_path.Context_Path,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'accept broken commits': boolean
}