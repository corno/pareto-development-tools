import * as p_ from 'pareto-core/interface/command'

import * as command_actions from "../actions/commands.js"
import type * as actions_commands_pareto_resources from "pareto-resources/interface/command_actions"
import type * as actions_queries_pareto_resources from "pareto-resources/interface/query_actions"
import type * as actions_commands_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/command_actions"
import type * as actions_queries_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/query_actions"

export type npm = p_.Command<
    command_actions.npm,
    null,
    null,
    {
        'npm': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type npm_publish = p_.Command<
    command_actions.npm_publish,
    null,
    null,
    {
        'npm': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type set_up_comparison_against_published = p_.Command<
    command_actions.set_up_comparison_against_published,
    null,
    {
        'read file': actions_queries_pareto_filesystem_unrestricted_api.read_file
        'npm': actions_queries_pareto_resources.execute_sandboxed.query_executable
    },
    {
        'npm': actions_commands_pareto_resources.execute_sandboxed.command_executable
        'tar': actions_commands_pareto_resources.execute_sandboxed.command_executable
        'make directory': actions_commands_pareto_filesystem_unrestricted_api.make_directory
    }
>

export type update2latest = p_.Command<
    command_actions.update2latest,
    null,
    null,
    {
        'update2latest': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type update_package_dependencies = p_.Command<
    command_actions.update_package_dependencies,
    null,
    null,
    {
        'remove': actions_commands_pareto_filesystem_unrestricted_api.remove
        'update2latest': command_actions.update2latest
        'npm': command_actions.npm
    }
>