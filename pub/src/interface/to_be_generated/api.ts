import * as _pi from 'pareto-core-interface'


import * as d_analyze_file_structure from "./analyze_file_structure"
import * as d_list_file_structure_problems from "./analyze_file_structure"
import * as d_assert_clean from "../../modules/git/interface/to_be_generated/assert_is_clean"
import * as d_build from "./build"
import * as d_build_and_test from "./build_and_test"
import * as d_dependency_graph from "./create_dependency_graph"
import * as d_git_extended_commit from "../../modules/git/interface/to_be_generated/extended_commit"
import * as d_git_remove_tracked_but_ignored from "../../modules/git/interface/to_be_generated/remove_tracked_but_ignored"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"
import * as d_publish from "./publish"
import * as d_read_directory from "pareto-resources/dist/interface/generated/pareto/schemas/read_directory/data"
import * as d_set_up_comparison_against_published from "../../modules/npm/interface/to_be_generated/set_up_comparison_against_published"
import * as d_update_dependencies from "./update_package_dependencies"

export type Parameters =
    /**
     * run a command on a whole project (multiple packages)
     */
    | ['project', Project]

    /**
     * asserts that the git working tree is clean for 1 specified package
     */
    | ['assert clean', d_assert_clean.Parameters]


    | ['build and test', d_build_and_test.Parameters]


    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', {
        'path to package': d_path.Context_Path
    }]


    | ['dependency graph', d_dependency_graph.Parameters]


    | ['analyze file structure', d_analyze_file_structure.Parameters]


    | ['list file structure problems', d_list_file_structure_problems.Parameters]

    | ['publish', d_publish.Parameters]

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
    | ['build and test', {
        'concise': boolean
    }]

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
    | ['update package dependencies', null]

export type Error =
    | ['analyze file structure', d_analyze_file_structure.Error]
    | ['build and test', {
        'error': d_build_and_test.Error,
        'concise': boolean
    }]
    | ['dependency graph', d_dependency_graph.Error]
    | ['git assert clean', d_assert_clean.Error]
    | ['project', Project_Error]
    | ['publish', d_publish.Error]
    | ['set up comparison', d_set_up_comparison_against_published.Error]

export type Project_Error =
    | ['could not read packages directory', d_read_directory.Error]
    | ['packages', _pi.Dictionary<Project_Package_Error>]

export type Project_Package_Error =
    | ['build and test', {
        'error': d_build_and_test.Error,
        'concise': boolean
    }]
    | ['build', d_build.Error]
    | ['git assert clean', d_assert_clean.Error]
    | ['git commit', d_git_extended_commit.Error]
    | ['git remove tracked but ignored', d_git_remove_tracked_but_ignored.Error]
    | ['update dependencies', d_update_dependencies.Error]
    | ['set up comparison', d_set_up_comparison_against_published.Error]
