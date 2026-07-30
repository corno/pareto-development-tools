
import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_git_extended_commit from "../../submodules/version_control_api/interface/schemas/extended_commit.js"
import type * as s_build_and_validate from "../schemas/build_and_validate.js"

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