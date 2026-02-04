import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/expression'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/schemas/path/transformers/text"

//shorthands
import * as sh from "../../../../../temp_pseudo_fp"

export const $$: signatures.commands.npm = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _pt.list.nested_literal_old([
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            sh.b.literal("--prefix"),
                            sh.b.text(t_path_to_text.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _pt.decide.state($p.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return _pt.ss($, ($) => _pt.list.nested_literal_old([
                                [
                                   sh.b.literal("update"),
                                ],
                                $['package-lock only']
                                    ? _pt.list.literal([`--package-lock-only`])
                                    : _pt.list.literal([])

                            ]))
                            case 'install': return _pt.ss($, ($) => _pt.list.nested_literal_old([
                                [
                                    sh.b.literal("install"),
                                ],
                                $['package-lock only']
                                    ? _pt.list.literal([`--package-lock-only`])
                                    : _pt.list.literal([])

                            ]))
                            case 'version': return _pt.ss($, ($) => _pt.list.literal([
                                sh.b.literal("version"),
                                _p.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'patch': return _p.ss($, ($) => sh.b.literal("patch"))
                                        case 'minor': return _p.ss($, ($) => sh.b.literal("minor"))
                                        default: return _p.au($[0])
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