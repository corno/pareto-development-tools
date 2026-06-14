import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build_and_test"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: signatures.commands.build_and_test = pt.command_procedure(
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
                'working directory': pt.optional.literal.not_set(),
                'args': _pt.list.literal([
                    t_path_to_text.Context_Path(
                        t_path_to_path.extend_context_path_with_list(
                            $d.path,
                            {
                                'addition': _pt.list.literal([
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
                                'addition': _pt.list.literal([
                                    "testdata",
                                ])
                            }
                        )
                    ),
                ]).__l_map(($) => $)
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
