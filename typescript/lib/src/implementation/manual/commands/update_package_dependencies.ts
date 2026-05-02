import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/update_package_dependencies"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/path/path"

export const $$: signatures.commands.update_package_dependencies = _p.command_procedure(
    ($p, $cr) => [

        // update dependencies of lib
        $cr['npm update package dependencies'].execute(
            {
                'path': t_path_to_path.extend_context_path_with_list($p.path, { 'addition': _p.list.literal(["typescript", "lib"]) }),
            },
            ($): d.Error => ['error updating lib', $],
        ),

        // update dependencies of test
        $cr['npm update package dependencies'].execute(
            {
                'path': t_path_to_path.extend_context_path_with_list($p.path, { 'addition': _p.list.literal(["typescript", "test"])}),
            },
            ($) => ['error updating test', $],
        ),
    ]
)
