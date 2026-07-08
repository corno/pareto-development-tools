import * as p_ from 'pareto-core/interface/command'

import * as query_actions from "../../../version_control_api/interface/actions/queries.js"
import type * as actions_commands_pareto_resources from "pareto-resources/interface/command_actions"

import * as command_actions from "../../../version_control_api/interface/actions/commands.js"

export type assert_no_open_changes = p_.Command<
    command_actions.assert_no_open_changes,
    null,
    {
        'repository no open changes': query_actions.repository_no_open_changes
    },
    {
        'git': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type make_pristine = p_.Command<
    command_actions.make_pristine,
    null,
    null,
    {
        'git': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type extended_commit = p_.Command<
    command_actions.extended_commit,
    null,
    {
        'repository no open changes': query_actions.repository_no_open_changes
    },
    {
        'git': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>

export type push = p_.Command<
    command_actions.push,
    null,
    null,
    {
        'git': actions_commands_pareto_resources.execute_sandboxed.command_executable
    }
>