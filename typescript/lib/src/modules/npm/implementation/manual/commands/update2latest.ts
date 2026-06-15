import * as p_ from 'pareto-core/dist/command/implementation'
import * as p_t from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.commands.update2latest = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.update2latest.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_t.literal.nested_list([
                    p_t.literal.list([
                        t_path_to_text.Context_Path($d.path),
                    ]),
                    p_t.decide.state($d.what, ($) => {
                        // p_log_debug_message(`Updating ${$d.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return p_t.ss($, ($) => {
                                return p_t.literal.list(["dependencies"])
                            })
                            case 'dev-dependencies': return p_t.ss($, ($) => {
                                return p_t.literal.list(["devDependencies"])
                            })
                            default: return p_t.au($[0])
                        }
                    }),
                    // $d.verbose ? _pt.literal.list(["verbose"]) : _pt.literal.list([]),
                    p_t.literal.list(["verbose"])
                ]),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
