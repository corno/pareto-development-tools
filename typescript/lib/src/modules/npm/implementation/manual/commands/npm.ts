import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import * as pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.npm = pt.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': pt.optional.literal.not_set(),
                'args': _pt.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => _pt.list.literal([
                            "--prefix",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.decide.state($d.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return _pt.ss($, ($) => _pt.list.nested_literal_old([
                                [
                                    "update",
                                ],
                                $['package-lock only']
                                    ? _pt.list.literal(["--package-lock-only"])
                                    : _pt.list.literal([])

                            ]))
                            case 'install': return _pt.ss($, ($) => _pt.list.nested_literal_old([
                                [
                                    "install",
                                ],
                                $['package-lock only']
                                    ? _pt.list.literal(["--package-lock-only"])
                                    : _pt.list.literal([])

                            ]))
                            case 'version': return _pt.ss($, ($) => _pt.list.literal([
                                "version",
                                _pt.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'patch': return _pt.ss($, ($) => "patch")
                                        case 'minor': return _pt.ss($, ($) => "minor")
                                        default: return _pt.au($[0])
                                    }
                                })
                            ]))
                            default: return _pt.au($[0])
                        }
                    })
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)