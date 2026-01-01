import * as _pi from 'pareto-core-interface'

import * as resources from "./resources"
import * as resources_exupery from "pareto-resources/dist/interface/resources"

export namespace commands {

    export type npm = _pi.Command_Procedure<
        resources.commands.npm,
        {
            'npm': resources_exupery.commands.execute_command_executable
        },
        null
    >

    export type set_up_comparison_against_published = _pi.Command_Procedure<
        resources.commands.set_up_comparison_against_published,
        {
            'npm': resources_exupery.commands.execute_command_executable
            'tar': resources_exupery.commands.execute_command_executable
            'make directory': resources_exupery.commands.make_directory
            'remove': resources_exupery.commands.remove
        },
        {
            'read file': resources_exupery.queries.read_file
            'npm': resources_exupery.queries.execute_query_executable
        }
    >

    export type update2latest = _pi.Command_Procedure<
        resources.commands.update2latest,
        {
            'update2latest': resources_exupery.commands.execute_command_executable
        },
        null
    >

}