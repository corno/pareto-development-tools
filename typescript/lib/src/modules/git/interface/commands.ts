import * as p_ from 'pareto-core/dist/interface/command'

import * as queries from "./queries"
import * as resources_pareto from "pareto-resources/dist/interface/resources"

//data types
import * as d_assert_is_clean from "./data/assert_is_clean"
import * as d_make_pristine from "./data/make_pristine"
import * as d_push from "./data/push"
import * as d_extended_commit from "./data/extended_commit"
import * as d_remove_tracked_but_ignored from "./data/remove_tracked_but_ignored"

export namespace commands {

    export type assert_is_clean = p_.Command<d_assert_is_clean.Error, d_assert_is_clean.Parameters>
    export type make_pristine = p_.Command<d_make_pristine.Error, d_make_pristine.Parameters>
    export type extended_commit = p_.Command<d_extended_commit.Error, d_extended_commit.Parameters>
    export type push = p_.Command<d_push.Error, d_push.Parameters>
    export type remove_tracked_but_ignored = p_.Command<d_remove_tracked_but_ignored.Error, d_remove_tracked_but_ignored.Parameters>

}

export namespace procedures {

    export type assert_is_clean = p_.Command_Procedure<
        commands.assert_is_clean,
        null,
        {
            'is repository clean': queries.queries.is_repository_clean
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type make_pristine = p_.Command_Procedure<
        commands.make_pristine,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type extended_commit = p_.Command_Procedure<
        commands.extended_commit,
        null,
        {
            'git is repository clean': queries.queries.is_repository_clean
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type push = p_.Command_Procedure<
        commands.push,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type remove_tracked_but_ignored = p_.Command_Procedure<
        commands.remove_tracked_but_ignored,
        null,
        {
            'git': resources_pareto.execute_sandboxed.queries.query_executable,
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable,
            'assert is clean': commands.assert_is_clean
        }
    >

}