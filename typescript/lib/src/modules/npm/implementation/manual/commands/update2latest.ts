import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'

import * as signatures from "../../../interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

export const $$: signatures.procedures.update2latest = p_.command_procedure(
    ($d, $s, $q, $c) => [
        $c.update2latest.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_temp.literal.nested_list([
                    p_temp.literal.list([
                        t_path_to_text.Context_Path($d.path),
                    ]),
                    p_temp.decide.state($d.what, ($) => {
                        // p_log_debug_message(`Updating ${$d.path} to latest`, () => {})
                        switch ($[0]) {
                            case 'dependencies': return p_temp.ss($, ($) => {
                                return p_temp.literal.list(["dependencies"])
                            })
                            case 'dev-dependencies': return p_temp.ss($, ($) => {
                                return p_temp.literal.list(["devDependencies"])
                            })
                            default: return p_temp.au($[0])
                        }
                    }),
                    // $d.verbose ? _pt.literal.list(["verbose"]) : _pt.literal.list([]),
                    p_temp.literal.list(["verbose"])
                ]),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
