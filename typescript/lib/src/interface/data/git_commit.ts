import * as p_ from 'pareto-core/dist/interface/data'

import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"
import * as d_git_extended_commit from "../../modules/git/interface/data/extended_commit"
import * as d_build_and_test from "../data/build_and_test"

export type Error =
    | ['git extended commit', d_git_extended_commit.Error]
    | ['error while running build and test', d_build_and_test.Error]


export type Parameters = {
    'path': d_path.Context_Path,
    'instruction': Instruction,
}

export type Instruction = {
    'commit message': string
    'accept broken commits': boolean
}