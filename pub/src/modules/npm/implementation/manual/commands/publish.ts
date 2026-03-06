import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/path/text"

export const $$: signatures.commands.npm_publish = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'working directory': _p.optional.literal.not_set(),
                'args': _pt.list.nested_literal_old([
                    [
                        "publish"
                    ],
                    //publish doesn't support --prefix, so we have to use a path to the package as an argument instead
                    //but this has issues as well. If 

                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            t_path_to_text.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _p.decide.state($p.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return _p.ss($, ($) => ["--dry-run"])
                            case 'actual publish': return _p.ss($, ($) => [
                                // "--otp",
                                // $['one time password'],
                            ])
                            default: return _p.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)