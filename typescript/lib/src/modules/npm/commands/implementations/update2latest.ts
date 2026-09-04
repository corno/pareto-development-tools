import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"

export const $$: p_.Command_Implementation<
    command_interfaces.update2latest,
    null,
    null,
    {
        'update2latest': command_interfaces_pareto_resources.command_executable
    }
>
    = p_.command(
        ($d, $s, $q, $c) => [
            $c.update2latest.execute(
                {
                    'working directory': p_.literal.not_set(),
                    'args': p_temp.literal.segmented_list([
                        p_temp.literal.list([
                            ser_path.Context_Path($d.path),
                        ]),
                        p_temp.from.state($d.what).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'dependencies': return p_temp.option($, ($) => {
                                        return p_temp.literal.list(["dependencies"])
                                    })
                                    case 'dev-dependencies': return p_temp.option($, ($) => {
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
