import * as _pi from 'pareto-core-interface'

import * as resources from "./resources"
import * as resources_exupery from "pareto-resources/dist/interface/resources"

export namespace commands {

    export type assert_is_clean = _pi.Command_Procedure<
        resources.commands.assert_is_clean,
        {
            'git': resources_exupery.commands.execute_command_executable
        },
        {
            'is repository clean': resources.queries.is_repository_clean
        }
    >

    export type clean = _pi.Command_Procedure<
        resources.commands.clean,
        {
            'git': resources_exupery.commands.execute_command_executable
        },
        null
    >

    export type extended_commit = _pi.Command_Procedure<
        resources.commands.extended_commit,
        {
            'git': resources_exupery.commands.execute_command_executable
        },
        {
            'git is repository clean': resources.queries.is_repository_clean
        }
    >

    export type push = _pi.Command_Procedure<
        resources.commands.push,
        {
            'git': resources_exupery.commands.execute_command_executable
        },
        null
    >

    export type remove_tracked_but_ignored = _pi.Command_Procedure<
        resources.commands.remove_tracked_but_ignored,
        {
            'git': resources_exupery.commands.execute_command_executable,
            'assert is clean': resources.commands.assert_is_clean
        },
        {
            'git': resources_exupery.queries.execute_query_executable,
        }
    >

}

export namespace queries {

    export type is_inside_work_tree = _pi.Query_Function<
        resources.queries.is_inside_work_tree,
        {
            'git': resources_exupery.queries.execute_query_executable
        }
    >

    export type is_repository_clean = _pi.Query_Function<
        resources.queries.is_repository_clean,
        {
            'is inside git work tree': resources.queries.is_inside_work_tree
            'git': resources_exupery.queries.execute_query_executable
        }
    >

}