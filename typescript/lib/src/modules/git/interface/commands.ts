import * as p_ from 'pareto-core/interface/command'

import * as queries from "../../version_control_api/interface/queries.js"
import * as resources_pareto from "pareto-resources/interface/resources"

import * as commands from "../../version_control_api/interface/commands.js"

export namespace procedures {

    export type assert_no_open_changes = p_.Command_Procedure<
        commands.commands.assert_no_open_changes,
        null,
        {
            'repository no open changes': queries.queries.repository_no_open_changes
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type make_pristine = p_.Command_Procedure<
        commands.commands.make_pristine,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type extended_commit = p_.Command_Procedure<
        commands.commands.extended_commit,
        null,
        {
            'repository no open changes': queries.queries.repository_no_open_changes
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type push = p_.Command_Procedure<
        commands.commands.push,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

}