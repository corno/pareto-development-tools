import * as _et from 'exupery-core-types'

import * as d_read_directory from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import * as d_assert_clean from "../../../modules/git/interface/algorithms/commands/assert-clean"
import * as d_build_and_test from "./build_and_test"
import * as d_build from "./build"
import * as d_dependency_graph from "./dependency_graph"
import * as d_line_count from "./line_count"
import * as d_update_dependencies from "./update_dependencies"
import * as d_git_remove_tracked_but_ignored from "../../../modules/git/interface/algorithms/commands/remove_tracked_but_ignored"
import * as d_git_extended_commit from "../../../modules/git/interface/algorithms/commands/extended_commit"
import * as d_set_up_comparison_against_published from "../../../modules/npm/interface/algorithms/commands/set_up_comparison_against_published"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/source"

export type Command =
    /**
     * run a command on a whole project (multiple packages)
     */
    | ['project', Project]

    /**
     * asserts that the git working tree is clean for 1 specified package
     */
    | ['assert clean', {
        'path to package': d_path.Context_Path
    }]

    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', {
        'path to package': d_path.Context_Path
    }]


    | ['dependency graph', {
        'path to project': d_path.Context_Path
    }]


    | ['line count', {
        'path to project': d_path.Context_Path
    }]

export type Project = {
    'path to project': d_path.Context_Path
    'instruction': Project_Instruction
}

export type Project_Instruction =

    /**
     * verifies that the git working tree is clean, raises an error if not
     */
    | ['assert clean', null]

    /**
     * builds all packages and runs their tests
     */
    | ['build and test', null]

    | ['build', null]

    /**
     * stages all changes, makes a commit with the given message, and pushes the commit
     */
    | ['git extended commit', d_git_extended_commit.Instruction]

    /**
     * executes     `git rm -r --cached .`
     * followed by  `git add --all`
     */
    | ['git remove tracked but ignored', null]

    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', null]

    /**
     * for both the pub and test packages;
     * first runs  git clean
     * then        update2latest
     * then        npm install
     */
    | ['update dependencies', null]

export type Query_Resources = {
    'read directory': _et.Query<d_read_directory.Result, d_read_directory.Error, d_read_directory.Parameters>
}

export type Command_Resources = {
    'build and test': _et.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    'build': _et.Command<d_build.Error, d_build.Parameters>
    'dependency graph': _et.Command<d_dependency_graph.Error, d_dependency_graph.Parameters>
    'line count': _et.Command<d_line_count.Error, d_line_count.Parameters>
    'git assert clean': _et.Command<d_assert_clean.Error, d_assert_clean.Parameters>
    'git extended commit': _et.Command<d_git_extended_commit.Error, d_git_extended_commit.Parameters>
    'git remove tracked but ignored': _et.Command<d_git_remove_tracked_but_ignored.Error, d_git_remove_tracked_but_ignored.Parameters>
    'update dependencies': _et.Command<d_update_dependencies.Error, d_update_dependencies.Parameters>
    'set up comparison against published': _et.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
}

export type Error =
    | ['project', Project_Error]
    | ['git assert clean', d_assert_clean.Error]
    | ['set up comparison', d_set_up_comparison_against_published.Error]
    | ['dependency graph', d_dependency_graph.Error]
    | ['line count', d_line_count.Error]

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
    | ['set up comparison', d_set_up_comparison_against_published.Error]


export type Parameters = Command

export type Procedure = _et.Command_Procedure<Error, Parameters, Command_Resources, Query_Resources>