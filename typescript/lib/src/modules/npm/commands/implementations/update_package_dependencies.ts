import * as p_ from 'pareto-core/implementation/command'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/commands/interfaces"

//schemas
import * as d from "../../schemas/update_package_dependencies/schema.js"

//dependencies
import * as t_path_to_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/transformers/unrestricted_path"

export const $$: p_.Command_Implementation<
    command_interfaces.update_package_dependencies,
    null,
    null,
    {
        'remove': command_interfaces_pareto_filesystem_unrestricted_api.remove
        'update2latest': command_interfaces.update2latest
        'npm': command_interfaces.npm
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        // clean
        $c['remove'].execute(
            {
                'path': t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "node_modules" } ),
                'error if not exists': false,
            },
            ($): d.Error => ['could not remove node_modules', $],
        ),
        $c['remove'].execute(
            {
                'path': t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "package-lock.json" } ),
                'error if not exists': false,
            },
            ($): d.Error => ['could not remove package-lock.json', $],
        ),

        //don't update to the latest dependecies anymore... Maybe just report that there is a newer minor/major?

        // // update dependencies
        // $c['update2latest'].execute(
        //     {
        //         'path': $d.path,
        //         'verbose': false,
        //         'what': ['dependencies', null],
        //     },
        //     ($) => ['could not update to latest', $],
        // ),

        // install/update updated dependencies
        $c['npm'].execute(
            {
                'path': p_.literal.set($d.path),
                'operation': ['update', {
                    'package-lock only': false
                }], // 'install' does not update the indirect dependencies
            },
            ($) => ['could not install dependencies', $],
        ),
    ]
)