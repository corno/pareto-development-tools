import * as pqi from 'pareto-core/dist/query_interface'
import * as pci from 'pareto-core/dist/command_interface'


import * as resources from "./resources"
import * as resources_pareto from "pareto-resources/dist/interface/resources"

export namespace commands {

    export type npm = pci.Command_Procedure<
        resources.commands.npm,
        null,
        null,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type npm_publish = pci.Command_Procedure<
        resources.commands.npm_publish,
        null,
        null,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type set_up_comparison_against_published = pci.Command_Procedure<
        resources.commands.set_up_comparison_against_published,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
            'npm': resources_pareto.execute_sandboxed.queries.query_executable
        },
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
            'tar': resources_pareto.execute_sandboxed.commands.command_executable
            'make directory': resources_pareto.filesystem_unrestricted.commands.make_directory
        }
    >

    export type update2latest = pci.Command_Procedure<
        resources.commands.update2latest,
        null,
        null,
        {
            'update2latest': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type update_package_dependencies = pci.Command_Procedure<
        resources.commands.update_package_dependencies,
        null,
        null,
        {
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'update2latest': resources.commands.update2latest
            'npm': resources.commands.npm
        }
    >

}

export namespace queries {

    export type get_package_json = pqi.Query_Function<
        resources.queries.get_package_json,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        }
    >

}