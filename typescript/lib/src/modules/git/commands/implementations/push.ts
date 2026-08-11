import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as command_interfaces from "../../../version_control_api/commands/interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"

//schemas
import * as d from "../../../version_control_api/schemas/push/schema.js"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"


export const $$: p_.Command_Implementation<
    command_interfaces.push,
    null,
    null,
    {
        'git': command_interfaces_pareto_resources.command_executable
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
                            ser_path.Context_Path($),
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