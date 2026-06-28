import * as p_ from 'pareto-core/dist/interface/command'

import * as queries from "./queries"
import * as resources_pareto from "pareto-resources/dist/interface/resources"
import * as resources_pareto_stream from "pareto-stream/dist/interface/commands"
import * as resources_version_control from "../modules/version_control_api/interface/commands"
import * as resources_npm from "../modules/npm/interface/commands"

import * as d_get_project_files from "./data/get_project_files"
import * as d_api from "./data/execute_command"
import * as d_build from "./data/build"
import * as d_build_and_test from "./data/build_and_test"
import * as d_create_dependency_graph from "./data/create_dependency_graph"
import * as d_publish from "./data/publish"
import * as d_tsc from "./data/tsc"
import * as d_update_package_dependencies from "./data/update_package_dependencies"
import * as d_version_control_commit from "./data/git_commit"



export namespace commands {

    export type analyze_file_structure = p_.Command<d_get_project_files.Error, d_get_project_files.Parameters>
    export type api = p_.Command<d_api.Error, d_api.Parameters>
    export type build = p_.Command<d_build.Error, d_build.Parameters>
    export type build_and_test = p_.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    export type create_dependency_graph = p_.Command<d_create_dependency_graph.Error, d_create_dependency_graph.Parameters>
    export type version_control_commit = p_.Command<d_version_control_commit.Error, d_version_control_commit.Parameters>
    export type publish = p_.Command<d_publish.Error, d_publish.Parameters>
    export type tsc = p_.Command<d_tsc.Error, d_tsc.Parameters>
    export type update_package_dependencies = p_.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>
    
}

export namespace procedures {

    export type analyze_file_structure = p_.Command_Procedure<
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

    export type api = p_.Command_Procedure<
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
            'version control assert no open changes': resources_version_control.commands.assert_no_open_changes
            'commit changes': commands.version_control_commit
            'list file structure problems': commands.analyze_file_structure
            'npm set up comparison against published': resources_npm.commands.set_up_comparison_against_published
            'publish': commands.publish
            'update package dependencies': commands.update_package_dependencies
        }
    >

    export type build = p_.Command_Procedure<
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

    export type build_and_test = p_.Command_Procedure<
        commands.build_and_test,
        null,
        null,
        {
            'build': commands.build
            'node': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type create_dependency_graph = p_.Command_Procedure<
        commands.create_dependency_graph,
        null,
        {
            'package dependencies': queries.queries.get_package_dependencies
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type version_control_commit = p_.Command_Procedure<
        commands.version_control_commit,
        null,
        null,
        {
            'build and test': commands.build_and_test
            'version control extended commit': resources_version_control.commands.extended_commit
        }
    >

    export type list_file_structure_problems = p_.Command_Procedure<
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

    export type main = p_.Command_Procedure<
        resources_pareto.resources.commands.main,
        null,
        null,
        {
            'api': commands.api
            'log error': resources_pareto_stream.commands.log_error

        }
    >

    export type publish = p_.Command_Procedure<
        commands.publish,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'version control push': resources_version_control.commands.push
            'version control extended commit': resources_version_control.commands.extended_commit
            'version control assert no open changes': resources_version_control.commands.assert_no_open_changes
            'version control make pristine': resources_version_control.commands.make_pristine
            'update package dependencies': commands.update_package_dependencies
            'build and test': commands.build_and_test
            'npm': resources_npm.commands.npm
            'npm publish': resources_npm.commands.npm_publish
            'log': resources_pareto_stream.commands.log
        }
    >

    export type tsc = p_.Command_Procedure<
        commands.tsc,
        null,
        null,
        {
            'tsc': resources_pareto.execute_sandboxed.commands.smelly_command_executable
        }
    >

    export type update_package_dependencies = p_.Command_Procedure<
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