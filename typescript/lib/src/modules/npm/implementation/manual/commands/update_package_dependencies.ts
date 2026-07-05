import * as p_ from 'pareto-core/implementation/command'

import * as interface_ from "../../../interface/commands.js"

//data types
import * as d from "../../../interface/data/update_package_dependencies.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: interface_.procedures.update_package_dependencies = p_.command_procedure(
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

        // update dependencies
        $c['update2latest'].execute(
            {
                'path': $d.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
            ($) => ['could not update to latest', $],
        ),

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