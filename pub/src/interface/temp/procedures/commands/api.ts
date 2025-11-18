import * as _et from 'exupery-core-types'


import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_e_smelly_pe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"

import * as d_assert_clean from "../../../../modules/git/interface/assert-clean"
import * as d_build_and_test from "./build_and_test"
import * as d_build from "./build"
import * as d_update_dependencies from "./update_dependencies"
import * as d_git_remove_tracked_but_ignored from "../../../../modules/git/interface/remove_tracked_but_ignored"
import * as d_git_extended_commit from "../../../../modules/git/interface/extended_commit"
import * as d_set_up_comparison_against_published from "../../../../modules/npm/interface/set_up_comparison_against_published"

export type Command =
    | ['project', Project]
    | ['assert-clean', {
        'path to package': string
    }]
    | ['setup-comparison', {
        'path to package': string
    }]

export type Project = {
    'path to project': string
    'instruction': Project_Instruction
}

export type Project_Instruction =
    | ['assert clean', null]
    | ['build and test', null]
    | ['build', null]
    | ['git commit', d_git_extended_commit.Instruction]
    | ['git remove tracked but ignored', null]
    | ['update dependencies', null]

export type Query_Resources = {
    'read directory': _et.Stager<d_read_directory.Result, d_read_directory.Error, d_read_directory.Parameters>
}

export type Command_Resources = {
    'build and test': _et.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    'build': _et.Command<d_build.Error, d_build.Parameters>
    'git assert clean': _et.Command<d_assert_clean.Error, d_assert_clean.Parameters>
    'git extended commit': _et.Command<d_git_extended_commit.Error, d_git_extended_commit.Parameters>
    'git remove tracked but ignored': _et.Command<d_git_remove_tracked_but_ignored.Error, d_git_remove_tracked_but_ignored.Parameters>
    'update dependencies': _et.Command<d_update_dependencies.Error, d_update_dependencies.Parameters>
    'setup comparison against published': _et.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
}

export type Error =
    | ['project', Project_Error]
    | ['git assert clean', d_assert_clean.Error]
    | ['setup comparison', d_set_up_comparison_against_published.Error]

export type Project_Error =
    | ['could not read packages directory', d_read_directory.Error]
    | ['packages', _et.Dictionary<Project_Package_Error>]

export type Project_Package_Error =
    | ['build and test', d_build_and_test.Error]
    | ['build', d_build.Error]
    | ['git assert clean', d_assert_clean.Error]
    | ['git commit', d_git_extended_commit.Error]
    | ['git remove tracked but ignored', d_git_remove_tracked_but_ignored.Error]
    | ['update dependencies', d_update_dependencies.Error]

export type Parameters = Command

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>