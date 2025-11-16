import * as _et from 'exupery-core-types'


import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_e_smelly_pe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_log from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/source"
import * as d_write_to_stderr from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/source"
import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"

import * as d_assert_clean from "./commands/git-assert-clean"
import * as d_build_and_test from "./commands/build_and_test"
import * as d_build from "./commands/build"
import * as d_update_dependencies from "./commands/update_dependencies"
import * as d_git_remove_tracked_but_ignored from "./commands/git_remove_tracked_but_ignored"
import * as d_git_extended_commit from "./commands/git_extended_commit"

export type Command =
    | ['project', Project]
    | ['assert-clean', {
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

export type Resources = {
    'queries': {
        'read directory': _et.Query<d_read_directory.Parameters, d_read_directory.Result, d_read_directory.Error>
    },
    'commands': {
        // 'git': _et.Command<d_epe.Parameters, d_epe.Error>
        // 'log': _et.Command<d_log.Parameters, null>
        // 'node': _et.Command<d_epe.Parameters, d_epe.Error>
        // 'npm': _et.Command<d_epe.Parameters, d_epe.Error>
        // 'tsc': _et.Command<d_e_smelly_pe.Parameters, d_e_smelly_pe.Error>
        // 'update2latest': _et.Command<d_epe.Parameters, d_epe.Error>
        // 'write to stderr': _et.Command<d_write_to_stderr.Parameters, null>
        'git assert clean': _et.Command<d_assert_clean.Parameters, d_assert_clean.Error>
        'build and test': _et.Command<d_build_and_test.Parameters, d_build_and_test.Error>
        'build': _et.Command<d_build.Parameters, d_build.Error>
        'git remove tracked but ignored': _et.Command<d_git_remove_tracked_but_ignored.Parameters, d_git_remove_tracked_but_ignored.Error>
        'update dependencies': _et.Command<d_update_dependencies.Parameters, d_update_dependencies.Error>
        'git extended commit': _et.Command<d_git_extended_commit.Parameters, d_git_extended_commit.Error>

    }
}

export type Error =
    | ['project', Project_Error]
    | ['git assert clean', d_assert_clean.Error]

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

export type Procedure = _et.Command_Procedure<Parameters, Error, Resources>