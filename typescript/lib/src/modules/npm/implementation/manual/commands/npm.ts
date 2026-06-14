import * as p_ from 'pareto-core/dist/command'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.npm = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.optional.literal.not_set(),
                'args': p_t.list.nested_literal_old([
                    $d.path.__decide(
                        ($) => p_t.list.literal([
                            "--prefix",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_t.list.literal([])
                    ),
                    p_t.decide.state($d.operation, ($) => {
                        switch ($[0]) {
                            case 'update': return p_t.ss($, ($) => p_t.list.nested_literal_old([
                                [
                                    "update",
                                ],
                                $['package-lock only']
                                    ? p_t.list.literal(["--package-lock-only"])
                                    : p_t.list.literal([])

                            ]))
                            case 'install': return p_t.ss($, ($) => p_t.list.nested_literal_old([
                                [
                                    "install",
                                ],
                                $['package-lock only']
                                    ? p_t.list.literal(["--package-lock-only"])
                                    : p_t.list.literal([])

                            ]))
                            case 'version': return p_t.ss($, ($) => p_t.list.literal([
                                "version",
                                p_t.decide.state($, ($) => {
                                    switch ($[0]) {
                                        case 'patch': return p_t.ss($, ($) => "patch")
                                        case 'minor': return p_t.ss($, ($) => "minor")
                                        default: return p_t.au($[0])
                                    }
                                })
                            ]))
                            default: return p_t.au($[0])
                        }
                    })
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)