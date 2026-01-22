import * as _p from 'pareto-core/dist/command'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/update_package_dependencies"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"

export const $$: signatures.commands.update_package_dependencies = _p.command_procedure(
    ($p, $cr) => [

        // clean
        $cr['remove'].execute(
            {
                'path': t_path_to_path.create_node_path($p.path, "node_modules" ),
                'error if not exists': false,
            },
            ($): d.Error => ['could not remove node_modules', $],
        ),
        $cr['remove'].execute(
            {
                'path': t_path_to_path.create_node_path($p.path, "package-lock.json" ),
                'error if not exists': false,
            },
            ($): d.Error => ['could not remove package-lock.json', $],
        ),

        // update dependencies
        $cr['update2latest'].execute(
            {
                'path': $p.path,
                'verbose': false,
                'what': ['dependencies', null],
            },
            ($) => ['could not update to latest', $],
        ),

        // install/update updated dependencies
        $cr['npm'].execute(
            {
                'path': _p.optional.set($p.path),
                'operation': ['update', null], // 'install' does not update the indirect dependencies
            },
            ($) => ['could not install dependencies', $],
        ),
    ]
)