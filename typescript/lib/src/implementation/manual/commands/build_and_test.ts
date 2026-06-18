import * as p_ from 'pareto-core/dist/implementation/command'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/build_and_test"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: interface_.procedures.build_and_test = p_.command_procedure(
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
                    t_path_to_text.Context_Path(
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
                    t_path_to_text.Context_Path(
                        t_path_to_path.extend_context_path_with_list(
                            $d.path,
                            {
                                'addition': p_.literal.list([
                                    "testdata",
                                ])
                            }
                        )
                    ),
                ]).__l_map(
                    ($) => $
                )
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
