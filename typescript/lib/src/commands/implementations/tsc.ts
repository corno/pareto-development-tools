import * as p_ from 'pareto-core/command'
import * as p_t from 'pareto-core/transformer'
import * as p_s from 'pareto-core/serializer'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"

export const $$: p_.Command_Implementation<
    command_interfaces.tsc,
    null,
    null,
    {
        'tsc': command_interfaces_pareto_resources.smelly_command_executable
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
                                ser_path.Context_Path($),
                        ]),
                        () => p_.literal.list([])
                    ),
                ]),
            },
            ($) => ['error while running tsc', $],
        )
    ]
)
