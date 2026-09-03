import * as p_ from 'pareto-core/implementation/command'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"
import type * as command_interfaces_file_structure_analysis from "../../modules/file_structure_analysis/commands/interfaces.js"

//schemas
import * as d from "../../schemas/build_and_validate/schema.js"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"
import * as t_path_to_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/transformers/unrestricted_path"

export const $$: p_.Command_Implementation<
    command_interfaces.build_and_validate,
    null,
    null,
    {
        'build': command_interfaces.build,
        'node': command_interfaces_pareto_resources.command_executable,
        'validate file structure': command_interfaces.validate_file_structure
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        // build
        $c.build.execute(
            {
                'path': $d.path,
            },
            ($): d.Error => ['building', $],
        ),

        // test
        $c.node.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.list([
                    ser_path.Context_Path(
                        t_path_to_path.extend_context_path_with_list(
                            $d.path,
                            {
                                'addition': p_.literal.list([
                                    "typescript",
                                    "test",
                                    "dist",
                                    "bin",
                                    "test.js",
                                ])
                            }
                        )
                    ),
                    ser_path.Context_Path(
                        t_path_to_path.extend_context_path_with_list(
                            $d.path,
                            {
                                'addition': p_.literal.list([
                                    "testdata",
                                ])
                            }
                        )
                    ),
                ])
            },
            ($): d.Error => ['testing', $],
        ),


        // validate no file structure problems
        $c['validate file structure'].execute(
            {
                'path to package': $d.path,
            },
            ($): d.Error => ['file structure validation', $],
        ),
    ]
)
