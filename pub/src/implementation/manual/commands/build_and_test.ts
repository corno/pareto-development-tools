import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build_and_test"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/path/text"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/path/path"

export const $$: signatures.commands.build_and_test = _p.command_procedure(
    ($p, $cr) => [

        // build
        $cr.build.execute(
            {
                'path': $p.path,
            },
            ($): d.Error => ['error building', $],
        ),

        // test
        $cr.node.execute(
            {
                'args': _pt.list.literal([
                    t_path_to_text.Context_Path(
                        t_path_to_path.extend_context_path_with_list(
                            $p.path,
                            {
                                'addition': _pt.list.literal([
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
                            $p.path,
                            {
                                'addition': _pt.list.literal([
                                    "testdata",
                                ])
                            }
                        )
                    ),
                ]).__l_map(($) => _p_text_from_list($, ($) => $))
            },
            ($): d.Error => ['error testing', $],
        ),
    ]
)
