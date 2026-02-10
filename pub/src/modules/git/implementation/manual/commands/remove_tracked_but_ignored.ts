import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/remove_tracked_but_ignored"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/schemas/path/transformers/text"

//shorthands
import * as sh from "../../../../../temp_loc_to_string"

export const $$: signatures.commands.remove_tracked_but_ignored = _p.command_procedure(
    ($p, $cr) => [
        $cr['assert is clean'].execute(
            {
                'path': $p.path,
            },
            ($): d.Error => _pt.decide.state($, ($) => {
                switch ($[0]) {
                    case 'working directory is not clean': return _pt.ss($, ($): d.Error => ['not clean', null])
                    case 'unexpected error': return _pt.ss($, ($): d.Error => ['unexpected error', $])
                    default: return _pt.au($[0])
                }
            }),
        ),
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            sh.serialize(t_path_to_text.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "rm",
                        "-r",
                        "--cached",
                        "."
                    ])
                ]),
            },
            ($) => ['could not remove', $],
        ),
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            sh.serialize(t_path_to_text.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "add",
                        "--all",
                    ])
                ]),
            },
            ($) => ['could not add', $],
        ),
        $cr.git.execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            "-C",
                            sh.serialize(t_path_to_text.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.list.literal([
                        "clean",
                        "-fd",
                    ])
                ]),
            },
            ($) => ['could not clean', $],
        ),
    ]
)