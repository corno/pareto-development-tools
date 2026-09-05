import * as p_ from 'pareto-core/command'

//interface dependencies
import type * as command_interfaces from "../../../version_control_api/commands/interfaces.js"
import type * as query_interfaces from "../../../version_control_api/queries/interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"

//schemas
import * as d from "../../../version_control_api/schemas/assert_no_open_changes/schema.js"

export const $$: p_.Command_Implementation<
    command_interfaces.assert_no_open_changes,
    null,
    {
        'repository no open changes': query_interfaces.repository_no_open_changes
    },
    {
        'git': command_interfaces_pareto_resources.command_executable
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            $q['repository no open changes'](
                {
                    'path': $d.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ($) => [

                p_.s.assert(
                    $,
                    ['working directory has open changes', null]
                )

            ]
        ),

    ]
)