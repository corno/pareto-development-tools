import * as _pi from 'pareto-core/dist/interface'

import * as resources from "./resources"
import * as resources_pareto from "pareto-resources/dist/interface/resources"

export namespace commands {

    export type npm = _pi.Command_Procedure<
        resources.commands.npm,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        },
        null,
        null
    >

    export type npm_publish = _pi.Command_Procedure<
        resources.commands.npm_publish,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        },
        null,
        null
    >

    export type set_up_comparison_against_published = _pi.Command_Procedure<
        resources.commands.set_up_comparison_against_published,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
            'tar': resources_pareto.execute_sandboxed.commands.command_executable
            'make directory': resources_pareto.filesystem_unrestricted.commands.make_directory
        },
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
            'npm': resources_pareto.execute_sandboxed.queries.query_executable
        },
        null
    >

    export type update2latest = _pi.Command_Procedure<
        resources.commands.update2latest,
        {
            'update2latest': resources_pareto.execute_sandboxed.commands.command_executable
        },
        null,
        null
    >

    export type update_package_dependencies = _pi.Command_Procedure<
        resources.commands.update_package_dependencies, {
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'update2latest': resources.commands.update2latest
            'npm': resources.commands.npm
        },
        null,
        null
    >

}

export namespace queries {

    export type get_package_json = _pi.Query_Function<
        resources.queries.get_package_json,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        null
    >

}