import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/expression'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/make_pristine"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/schemas/path/transformers/text"

//shorthands
import * as sh from "../../../../../temp_pseudo_fp"

export const $$: signatures.commands.make_pristine = _p.command_procedure(
    ($p, $cr) => [
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            sh.b.literal("-C"),
                            sh.b.text(t_path_to_text.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        sh.b.literal("clean"),
                        sh.b.literal("--force"),
                        sh.b.literal("-d"), // remove whole directories
                        sh.b.literal("-X"), // remove only ignored files (not the capital X as opposed to -x which removes all untracked files, including unignored ones)

                    ])
                ]),
            },
            ($) => ['unexpected error', $],
        )
    ]
)