import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.update2latest = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.update2latest.execute(
            {
                'working directory': p_.optional.literal.not_set(),
                'args': p_t.list.nested_literal_old([
                    p_t.list.literal([
                        t_path_to_text.Context_Path($d.path),
                    ]),
                    p_t.decide.state($d.what, ($) => {
                        // p_log_debug_message(`Updating ${$d.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return p_t.ss($, ($) => {
                                return p_t.list.literal(["dependencies"])
                            })
                            case 'dev-dependencies': return p_t.ss($, ($) => {
                                return p_t.list.literal(["devDependencies"])
                            })
                            default: return p_t.au($[0])
                        }
                    }),
                    // $d.verbose ? _pt.list.literal(["verbose"]) : _pt.list.literal([]),
                    p_t.list.literal(["verbose"])
                ]),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
