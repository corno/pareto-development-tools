import * as p_ from 'pareto-core/interface/command'

import * as query_actions from "../actions/queries.js"
import * as actions_queries_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/query_actions"
import * as command_actions from "../actions/commands.js"
import * as actions_commands_npm from "../../modules/npm/interface/actions/commands.js"
import * as actions_commands_pareto_application_api from "pareto-application-api/interface/command_actions"
import * as actions_commands_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/command_actions"
import * as actions_commands_pareto_resources from "pareto-resources/interface/command_actions"
import * as actions_commands_pareto_stream_api from "pareto-stream-api/interface/command_actions"
import * as actions_commands_version_control from "../../modules/version_control_api/interface/actions/commands.js"

export type analyze_file_structure = p_.Command<
    command_actions.analyze_file_structure,
    null,
    {
        'read directory': actions_queries_pareto_filesystem_unrestricted_api.read_directory,
        'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log': actions_commands_pareto_stream_api.log
    }
>

export type api = p_.Command<
    command_actions.api,
    null,
    {
        'read directory': actions_queries_pareto_filesystem_unrestricted_api.read_directory
    },
    {
        'analyze file structure': command_actions.analyze_file_structure
        'build and test': command_actions.build_and_test
        'build': command_actions.build
        'create dependency graph': command_actions.create_dependency_graph
        'version control assert no open changes': actions_commands_version_control.assert_no_open_changes
        'commit changes': command_actions.version_control_commit
        'list file structure problems': command_actions.analyze_file_structure
        'npm set up comparison against published': actions_commands_npm.set_up_comparison_against_published
        'publish': command_actions.publish
        'update package dependencies': command_actions.update_package_dependencies
    }
>

export type build = p_.Command<
    command_actions.build,
    null,
    {
        'stat': actions_queries_pareto_filesystem_unrestricted_api.stat_possible_node
    },
    {
        'tsc': command_actions.tsc
        'remove': actions_commands_pareto_filesystem_unrestricted_api.remove
        'chmod': actions_commands_pareto_filesystem_unrestricted_api.chmod
    }
>

export type build_and_test = p_.Command<
    command_actions.build_and_test,
    null,
    null,
    {
        'build': command_actions.build
        'node': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type create_dependency_graph = p_.Command<
    command_actions.create_dependency_graph,
    null,
    {
        'package dependencies': query_actions.get_package_dependencies
    },
    {
        'log': actions_commands_pareto_stream_api.log
    }
>

export type version_control_commit = p_.Command<
    command_actions.version_control_commit,
    null,
    null,
    {
        'build and test': command_actions.build_and_test
        'version control extended commit': actions_commands_version_control.extended_commit
    }
>

export type list_file_structure_problems = p_.Command<
    command_actions.analyze_file_structure,
    null,
    {
        'read directory': actions_queries_pareto_filesystem_unrestricted_api.read_directory,
        'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log': actions_commands_pareto_stream_api.log
    }
>

export type main = p_.Command<
    actions_commands_pareto_application_api.main,
    null,
    null,
    {
        'api': command_actions.api
        'log error': actions_commands_pareto_stream_api.log_error

    }
>

export type publish = p_.Command<
    command_actions.publish,
    null,
    {
        'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'version control push': actions_commands_version_control.push
        'version control extended commit': actions_commands_version_control.extended_commit
        'version control assert no open changes': actions_commands_version_control.assert_no_open_changes
        'version control make pristine': actions_commands_version_control.make_pristine
        'update package dependencies': command_actions.update_package_dependencies
        'build and test': command_actions.build_and_test
        'npm': actions_commands_npm.npm
        'npm publish': actions_commands_npm.npm_publish
        'log': actions_commands_pareto_stream_api.log
    }
>

export type tsc = p_.Command<
    command_actions.tsc,
    null,
    null,
    {
        'tsc': actions_commands_pareto_resources.execute_sandboxed.smelly_command_executable
    }
>

export type update_package_dependencies = p_.Command<
    command_actions.update_package_dependencies,
    null,
    {
        'stat': actions_queries_pareto_filesystem_unrestricted_api.stat_possible_node
    },
    {
        'npm update package dependencies': actions_commands_npm.update_package_dependencies
    }
>