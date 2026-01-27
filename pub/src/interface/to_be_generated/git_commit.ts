import * as _pi from 'pareto-core/dist/interface'

import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"
import * as d_git_extended_commit from "../../modules/git/interface/to_be_generated/extended_commit"
import * as d_build_and_test from "../to_be_generated/build_and_test"

export type Error =
    | ['git extended commit', d_git_extended_commit.Error]
    | ['error while running build and test', d_build_and_test.Error]


export type Parameters = {
    'path': d_path.Context_Path,
    'skip build and tests': boolean,
    'instruction': Instruction,
}

export type Instruction = d_git_extended_commit.Instruction