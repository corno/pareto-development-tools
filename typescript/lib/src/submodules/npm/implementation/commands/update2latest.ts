import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../interface/commands.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

export const $$: p_.Command_Implementation<
    command_interfaces.update2latest,
    null,
    null,
    {
        'update2latest': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
>
 = p_.command(
    ($d, $s, $q, $c) => [
        $c.update2latest.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_temp.literal.segmented_list([
                    p_temp.literal.list([
                        t_path_to_text.Context_Path($d.path),
                    ]),
                    p_temp.from.state($d.what).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'dependencies': return p_temp.ss($, ($) => {
                                    return p_temp.literal.list(["dependencies"])
                                })
                                case 'dev-dependencies': return p_temp.ss($, ($) => {
                                    return p_temp.literal.list(["devDependencies"])
                                })
                                default: return p_temp.exhaustive($[0])
                            }
                        }),
                    p_temp.literal.list(["verbose"])
                ]),
            },
            ($) => ['error while running update2latest', $],
        )
    ]
)
