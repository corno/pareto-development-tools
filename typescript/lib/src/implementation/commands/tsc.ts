import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../interface/commands.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

export const $$: p_.Command_Implementation<
    command_interfaces.tsc,
    null,
    null,
    {
        'tsc': command_interfaces_pareto_resources.execute_sandboxed.smelly_command_executable
    }
> = p_.command(

    // tsc
    ($d, $s, $q, $c) => [
        $c.tsc.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_.literal.list([
                        "--pretty",
                    ]),
                    p_t.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "--project",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
