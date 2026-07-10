import * as p_ from 'pareto-core/interface/command_implementation'

import type * as command_interfaces from "../interface/commands.js"
import type * as command_interfaces_npm from "../modules/npm/interface/commands.js"
import type * as command_interfaces_pareto_application_api from "pareto-application-api/interface/commands"
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/commands"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/interface/commands"
import type * as command_interfaces_version_control from "../modules/version_control_api/interface/commands.js"
import type * as query_interfaces from "../interface/queries.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"

//data types
import * as d_structure from "../interface/data/structure.js"

export type analyze_file_structure = p_.Command_Implementation<
    command_interfaces.analyze_file_structure,
    {
        'structure': d_structure.Directory
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log': command_interfaces_pareto_stream_api.log
    }
>

export type api = p_.Command_Implementation<
    command_interfaces.api,
    null,
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory
    },
    {
        'analyze file structure': command_interfaces.analyze_file_structure
        'build and test': command_interfaces.build_and_test
        'build': command_interfaces.build
        'create dependency graph': command_interfaces.create_dependency_graph
        'version control assert no open changes': command_interfaces_version_control.assert_no_open_changes
        'commit changes': command_interfaces.version_control_commit
        'list file structure problems': command_interfaces.analyze_file_structure
        'npm set up comparison against published': command_interfaces_npm.set_up_comparison_against_published
        'publish': command_interfaces.publish
        'update package dependencies': command_interfaces.update_package_dependencies
    }
>

export type build = p_.Command_Implementation<
    command_interfaces.build,
    null,
    {
        'stat': query_interfaces_pareto_filesystem_unrestricted_api.stat_possible_node
    },
    {
        'tsc': command_interfaces.tsc
        'remove': command_interfaces_pareto_filesystem_unrestricted_api.remove
        'chmod': command_interfaces_pareto_filesystem_unrestricted_api.chmod
    }
>

export type build_and_test = p_.Command_Implementation<
    command_interfaces.build_and_test,
    null,
    null,
    {
        'build': command_interfaces.build
        'node': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type create_dependency_graph = p_.Command_Implementation<
    command_interfaces.create_dependency_graph,
    null,
    {
        'package dependencies': query_interfaces.get_package_dependencies
    },
    {
        'log': command_interfaces_pareto_stream_api.log
    }
>

export type version_control_commit = p_.Command_Implementation<
    command_interfaces.version_control_commit,
    null,
    null,
    {
        'build and test': command_interfaces.build_and_test
        'version control extended commit': command_interfaces_version_control.extended_commit
    }
>

export type list_file_structure_problems = p_.Command_Implementation<
    command_interfaces.analyze_file_structure,
    {
        'structure': d_structure.Directory
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log': command_interfaces_pareto_stream_api.log
    }
>

export type main = p_.Command_Implementation<
    command_interfaces_pareto_application_api.main,
    null,
    null,
    {
        'api': command_interfaces.api
        'log error': command_interfaces_pareto_stream_api.log_error

    }
>

export type publish = p_.Command_Implementation<
    command_interfaces.publish,
    null,
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'version control push': command_interfaces_version_control.push
        'version control extended commit': command_interfaces_version_control.extended_commit
        'version control assert no open changes': command_interfaces_version_control.assert_no_open_changes
        'version control make pristine': command_interfaces_version_control.make_pristine
        'update package dependencies': command_interfaces.update_package_dependencies
        'build and test': command_interfaces.build_and_test
        'npm': command_interfaces_npm.npm
        'npm publish': command_interfaces_npm.npm_publish
        'log': command_interfaces_pareto_stream_api.log
    }
>

export type tsc = p_.Command_Implementation<
    command_interfaces.tsc,
    null,
    null,
    {
        'tsc': command_interfaces_pareto_resources.execute_sandboxed.smelly_command_executable
    }
>

export type update_package_dependencies = p_.Command_Implementation<
    command_interfaces.update_package_dependencies,
    null,
    {
        'stat': query_interfaces_pareto_filesystem_unrestricted_api.stat_possible_node
    },
    {
        'npm update package dependencies': command_interfaces_npm.update_package_dependencies
    }
>