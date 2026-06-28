import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'

import * as interface_ from "../../../../version_control_api/interface/commands"

//data types
import * as d from "../../../../version_control_api/interface/data/remove_tracked_but_ignored"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: interface_.procedures.remove_tracked_but_ignored = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c['assert is clean'].execute(
            {
                'path': $d.path,
            },
            ($): d.Error => p_temp.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'working directory is not clean': return p_temp.ss($, ($): d.Error => ['not clean', null])
                        case 'unexpected error': return p_temp.ss($, ($): d.Error => ['unexpected error', $])
                        default: return p_temp.au($[0])
                    }
                }),
        ),
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_temp.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "rm",
                        "-r",
                        "--cached",
                        "."
                    ])
                ]),
            },
            ($) => ['could not remove', $],
        ),
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_temp.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "add",
                        "--all",
                    ])
                ]),
            },
            ($) => ['could not add', $],
        ),
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_temp.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "clean",
                        "-fd",
                    ])
                ]),
            },
            ($) => ['could not clean', $],
        ),
    ]
)