import * as p_ from 'pareto-core/interface/command_implementation'

import * as command_interfaces from "../interface/commands.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"
import type * as query_interfaces_pareto_resources from "pareto-resources/interface/queries"
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/commands"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/interface/queries"

export type npm = p_.Command_Implementation<
    command_interfaces.npm,
    null,
    null,
    {
        'npm': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type npm_publish = p_.Command_Implementation<
    command_interfaces.npm_publish,
    null,
    null,
    {
        'npm': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type set_up_comparison_against_published = p_.Command_Implementation<
    command_interfaces.set_up_comparison_against_published,
    null,
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
        'npm': query_interfaces_pareto_resources.execute_sandboxed.query_executable
    },
    {
        'npm': command_interfaces_pareto_resources.execute_sandboxed.command_executable
        'tar': command_interfaces_pareto_resources.execute_sandboxed.command_executable
        'make directory': command_interfaces_pareto_filesystem_unrestricted_api.make_directory
    }
>

export type update2latest = p_.Command_Implementation<
    command_interfaces.update2latest,
    null,
    null,
    {
        'update2latest': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>

export type update_package_dependencies = p_.Command_Implementation<
    command_interfaces.update_package_dependencies,
    null,
    null,
    {
        'remove': command_interfaces_pareto_filesystem_unrestricted_api.remove
        'update2latest': command_interfaces.update2latest
        'npm': command_interfaces.npm
    }
>