import * as p_ci from 'pareto-core/dist/interface/command'

import * as queries from "./queries"
import * as resources_pareto from "pareto-resources/dist/interface/resources"
import * as resources_pareto_stream from "pareto-stream/dist/interface/commands"
import * as resources_git from "../modules/git/interface/commands"
import * as resources_npm from "../modules/npm/interface/resources"

import * as d_get_project_files from "./to_be_generated/get_project_files"
import * as d_api from "./to_be_generated/execute_command"
import * as d_build from "./to_be_generated/build"
import * as d_build_and_test from "./to_be_generated/build_and_test"
import * as d_create_dependency_graph from "./to_be_generated/create_dependency_graph"
import * as d_publish from "./to_be_generated/publish"
import * as d_tsc from "./to_be_generated/tsc"
import * as d_update_package_dependencies from "./to_be_generated/update_package_dependencies"
import * as d_git_commit from "./to_be_generated/git_commit"



export namespace commands {

    export type analyze_file_structure = p_ci.Command<d_get_project_files.Error, d_get_project_files.Parameters>
    export type api = p_ci.Command<d_api.Error, d_api.Parameters>
    export type build = p_ci.Command<d_build.Error, d_build.Parameters>
    export type build_and_test = p_ci.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    export type create_dependency_graph = p_ci.Command<d_create_dependency_graph.Error, d_create_dependency_graph.Parameters>
    export type git_commit = p_ci.Command<d_git_commit.Error, d_git_commit.Parameters>
    export type publish = p_ci.Command<d_publish.Error, d_publish.Parameters>
    export type tsc = p_ci.Command<d_tsc.Error, d_tsc.Parameters>
    export type update_package_dependencies = p_ci.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>
    
}

export namespace procedures {

    export type analyze_file_structure = p_ci.Command_Procedure<
        commands.analyze_file_structure,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type api = p_ci.Command_Procedure<
        commands.api,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory
        },
        {
            'analyze file structure': commands.analyze_file_structure
            'build and test': commands.build_and_test
            'build': commands.build
            'create dependency graph': commands.create_dependency_graph
            'git assert is clean': resources_git.commands.assert_is_clean
            'git commit': commands.git_commit
            'git remove tracked but ignored': resources_git.commands.remove_tracked_but_ignored
            'list file structure problems': commands.analyze_file_structure
            'npm set up comparison against published': resources_npm.commands.set_up_comparison_against_published
            'publish': commands.publish
            'update package dependencies': commands.update_package_dependencies
        }
    >

    export type build = p_ci.Command_Procedure<
        commands.build,
        null,
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        {
            'tsc': commands.tsc
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'chmod': resources_pareto.filesystem_unrestricted.commands.chmod
        }
    >

    export type build_and_test = p_ci.Command_Procedure<
        commands.build_and_test,
        null,
        null,
        {
            'build': commands.build
            'node': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type create_dependency_graph = p_ci.Command_Procedure<
        commands.create_dependency_graph,
        null,
        {
            'package dependencies': queries.queries.get_package_dependencies
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type git_commit = p_ci.Command_Procedure<
        commands.git_commit,
        null,
        null,
        {
            'build and test': commands.build_and_test
            'git extended commit': resources_git.commands.extended_commit
        }
    >

    export type list_file_structure_problems = p_ci.Command_Procedure<
        commands.analyze_file_structure,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type main = p_ci.Command_Procedure<
        resources_pareto.resources.commands.main,
        null,
        null,
        {
            'api': commands.api
            'log error': resources_pareto_stream.commands.log_error

        }
    >

    export type publish = p_ci.Command_Procedure<
        commands.publish,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'git push': resources_git.commands.push
            'git extended commit': resources_git.commands.extended_commit
            'git assert is clean': resources_git.commands.assert_is_clean
            'git make pristine': resources_git.commands.make_pristine
            'update package dependencies': commands.update_package_dependencies
            'build and test': commands.build_and_test
            'npm': resources_npm.commands.npm
            'npm publish': resources_npm.commands.npm_publish
            'log': resources_pareto_stream.commands.log
        }
    >

    export type tsc = p_ci.Command_Procedure<
        commands.tsc,
        null,
        null,
        {
            'tsc': resources_pareto.execute_sandboxed.commands.smelly_command_executable
        }
    >

    export type update_package_dependencies = p_ci.Command_Procedure<
        commands.update_package_dependencies,
        null,
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        {
            'npm update package dependencies': resources_npm.commands.update_package_dependencies
        }
    >
}