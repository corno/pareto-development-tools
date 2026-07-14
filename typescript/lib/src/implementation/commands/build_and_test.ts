import * as p_ from 'pareto-core/implementation/command'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as command_interfaces from "../../interface/commands.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"

//schemas
import * as d from "../../interface/schemas/build_and_test.js"

//dependencies
import * as ser_path from "pareto-resources/implementation/serializers/unrestricted_path"
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"

export const $$: p_.Command_Implementation<
    command_interfaces.build_and_test,
    null,
    null,
    {
        'build': command_interfaces.build
        'node': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        // build
        $c.build.execute(
            {
                'path': $d.path,
            },
            ($): d.Error => ['error building', $],
        ),

        // test
        $c.node.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.list([
                    p_s.text_from_phrase(
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
                        "",
                        ""
                    ),
                    p_s.text_from_phrase(
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
                        "",
                        ""
                    )
                ])
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
