import * as p_ from 'pareto-core/dist/interface/data'


import * as d_get_project_files from "./get_project_files"
import * as d_assert_clean from "../../modules/version_control_api/interface/data/assert_no_open_changes"
import * as d_build from "./build"
import * as d_build_and_test from "./build_and_test"
import * as d_dependency_graph from "./create_dependency_graph"
import * as d_git_commit from "./git_commit"
import * as d_git_remove_tracked_but_ignored from "../../modules/version_control_api/interface/data/remove_tracked_but_ignored"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_path/data"
import * as d_publish from "./publish"
import * as d_read_directory from "pareto-resources/dist/interface/generated/liana/schemas/fs_unrestricted_read_directory/data"
import * as d_set_up_comparison_against_published from "../../modules/npm/interface/data/set_up_comparison_against_published"
import * as d_update_dependencies from "./update_package_dependencies"

export type Parameters = {
    'type':
    | ['all packages', All_Packages]
    | ['package', Package]
    | ['project', Project]



    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', {
        'path to package': d_path.Context_Path
    }]
    | ['publish', d_publish.Parameters]
}

export type All_Packages = {
    'path to project': d_path.Context_Path
    'instruction': All_Pacakges_Instruction
}

export type Package = {
    'path': d_path.Context_Path
    'instruction':
    /**
     * asserts that the git working tree is clean for 1 specified package
     */
    | ['assert no open changes', null]


    | ['build and test', null]
    | ['commit changes', d_git_commit.Instruction]
    | ['update package dependencies', null]

}

export type Project = {
    'path': d_path.Context_Path
    'instruction':

    | ['dependency graph', null]


    | ['analyze file structure', null]


    | ['list file structure problems', null]
}

export type All_Pacakges_Instruction =

    /**
     * verifies that the git working tree is clean, raises an error if not
     */
    | ['assert no open changes', null]

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
    | ['commit changes', d_git_commit.Instruction]

    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', null]

    /**
     * for both the lib and test packages;
     * first runs  git clean
     * then        update2latest
     * then        npm install
     */
    | ['update package dependencies', null]

export type Error =
    | ['all', All_Error]
    | ['package', Package_Error]

    | ['get project files', d_get_project_files.Error]
    | ['dependency graph', d_dependency_graph.Error]

    | ['set up comparison', d_set_up_comparison_against_published.Error]

export type Project_Error = null

export type Package_Error =
    | ['build and test', {
        'error': d_build_and_test.Error,
        'concise': boolean
    }]
    | ['version control assert no open changes', d_assert_clean.Error]
    | ['commit changes', d_git_commit.Error]
    | ['publish', d_publish.Error]
    | ['update dependencies', d_update_dependencies.Error]

export type All_Error =
    | ['could not read packages directory', d_read_directory.Error]
    | ['packages', p_.Dictionary<All__Package_Error>]

export type All__Package_Error =
    | ['build and test', {
        'error': d_build_and_test.Error,
        'concise': boolean
    }]
    | ['build', d_build.Error]
    | ['version control assert no open changes', d_assert_clean.Error]
    | ['commit changes', d_git_commit.Error]
    | ['update dependencies', d_update_dependencies.Error]
    | ['set up comparison', d_set_up_comparison_against_published.Error]
