import * as p_ from 'pareto-core/interface/command_implementation'

import * as query_interfaces from "../../version_control_api/interface/queries.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"

import * as command_interfaces from "../../version_control_api/interface/commands.js"

export type assert_no_open_changes = p_.Command_Implementation<
    command_interfaces.assert_no_open_changes,
    null,
    {
        'repository no open changes': query_interfaces.repository_no_open_changes
    },
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type make_pristine = p_.Command_Implementation<
    command_interfaces.make_pristine,
    null,
    null,
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type extended_commit = p_.Command_Implementation<
    command_interfaces.extended_commit,
    null,
    {
        'repository no open changes': query_interfaces.repository_no_open_changes
    },
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type push = p_.Command_Implementation<
    command_interfaces.push,
    null,
    null,
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>