
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"
import type * as d_git_extended_commit from "../../submodules/version_control_api/interface/data/extended_commit.js"
import type * as d_build_and_test from "../data/build_and_test.js"

export type Error =
    | ['version control extended commit', d_git_extended_commit.Error]
    | ['error while running build and test', d_build_and_test.Error]


export type Parameters = {
    'path': d_path.Context_Path,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'accept broken commits': boolean
}