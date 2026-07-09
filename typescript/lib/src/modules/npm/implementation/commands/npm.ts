import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../declarations/commands.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.npm = p_.command(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_temp.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "--prefix",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_temp.from.state($d.operation).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'update': return p_temp.ss($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "update",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'install': return p_temp.ss($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "install",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'version': return p_temp.ss($, ($) => p_.literal.list([
                                    "version",
                                    p_temp.from.state($).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'patch': return p_temp.ss($, ($) => "patch")
                                                case 'minor': return p_temp.ss($, ($) => "minor")
                                                default: return p_temp.exhaustive($[0])
                                            }
                                        })
                                ]))
                                default: return p_temp.exhaustive($[0])
                            }
                        })
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)