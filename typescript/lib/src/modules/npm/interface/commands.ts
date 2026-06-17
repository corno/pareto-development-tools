import * as p_ from 'pareto-core/dist/interface/command'

import * as d_npm from "./data/npm_tool"
import * as d_npm_publish from "./data/npm_publish"
import * as d_update2latest from "./data/update2latest"
import * as d_set_up_comparison_against_published from "./data/set_up_comparison_against_published"
import * as d_update_package_dependencies from "./data/update_package_dependencies"

export namespace commands {

    export type npm = p_.Command<d_npm.Error, d_npm.Parameters>
    export type npm_publish = p_.Command<d_npm_publish.Error, d_npm_publish.Parameters>
    export type update2latest = p_.Command<d_update2latest.Error, d_update2latest.Parameters>
    export type set_up_comparison_against_published = p_.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
    export type update_package_dependencies = p_.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>

}

import * as resources_pareto from "pareto-resources/dist/interface/resources"

export namespace procedures {

    export type npm = p_.Command_Procedure<
        commands.npm,
        null,
        null,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type npm_publish = p_.Command_Procedure<
        commands.npm_publish,
        null,
        null,
        {
            'npm': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type set_up_comparison_against_published = p_.Command_Procedure<
        commands.set_up_comparison_against_published,
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

    export type update2latest = p_.Command_Procedure<
        commands.update2latest,
        null,
        null,
        {
            'update2latest': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type update_package_dependencies = p_.Command_Procedure<
        commands.update_package_dependencies,
        null,
        null,
        {
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'update2latest': commands.update2latest
            'npm': commands.npm
        }
    >

}
