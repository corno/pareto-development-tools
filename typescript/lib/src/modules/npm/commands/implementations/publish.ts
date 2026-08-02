import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/commands/interfaces"

//dependencies

export const $$: p_.Command_Implementation<
    command_interfaces.npm_publish,
    null,
    null,
    {
        'npm': command_interfaces_pareto_resources.execute_sandboxed.command_executable
    }
> = p_.command(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.set($d.path),
                'args': p_temp.literal.segmented_list([
                    p_.literal.list([
                        "publish"
                    ]),
                    p_temp.from.state($d.impact).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'dry run': return p_temp.ss($, ($) => p_temp.literal.list(["--dry-run"]))
                                case 'actual publish': return p_temp.ss($, ($) => p_temp.literal.list([
                                    // "--otp",
                                    // $['one time password'],
                                ]))
                                default: return p_temp.exhaustive($[0])
                            }
                        }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)