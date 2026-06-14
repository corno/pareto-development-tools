import * as _pqi from 'pareto-core/dist/query_interface'
import * as _pci from 'pareto-core/dist/command_interface'

import * as resources from "./resources"
import * as resources_pareto from "pareto-resources/dist/interface/resources"

export namespace commands {

    export type assert_is_clean = _pci.Command_Procedure<
        resources.commands.assert_is_clean,
        null,
        {
            'is repository clean': resources.queries.is_repository_clean
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type make_pristine = _pci.Command_Procedure<
        resources.commands.make_pristine,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type extended_commit = _pci.Command_Procedure<
        resources.commands.extended_commit,
        null,
        {
            'git is repository clean': resources.queries.is_repository_clean
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type push = _pci.Command_Procedure<
        resources.commands.push,
        null,
        null,
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type remove_tracked_but_ignored = _pci.Command_Procedure<
        resources.commands.remove_tracked_but_ignored,
        null,
        {
            'git': resources_pareto.execute_sandboxed.queries.query_executable,
        },
        {
            'git': resources_pareto.execute_sandboxed.commands.command_executable,
            'assert is clean': resources.commands.assert_is_clean
        }
    >

}

export namespace queries {

    export type is_inside_work_tree = _pqi.Query_Function<
        resources.queries.is_inside_work_tree,
        null,
        {
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

    export type is_repository_clean = _pqi.Query_Function<
        resources.queries.is_repository_clean,
        null,
        {
            'is inside git work tree': resources.queries.is_inside_work_tree
            'git': resources_pareto.execute_sandboxed.queries.query_executable
        }
    >

}