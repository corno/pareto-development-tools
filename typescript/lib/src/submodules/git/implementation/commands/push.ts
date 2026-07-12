import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../../version_control_api/interface/commands.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/interface/commands"

//schemas
import * as d from "../../../version_control_api/interface/schemas/push.js"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"


export const $$: p_.Command_Implementation<
    command_interfaces.push,
    null,
    null,
    {
        'git': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
> = p_.command(
    ($d, $s, $q, $c) => [
        $c.git.execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_t.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "-C",
                            t_path_to_text.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_.literal.list([
                        "push",
                    ])
                ]),
            },
            ($): d.Error => ['could not push', $],
        )
    ]
)