import * as p_ from 'pareto-core/implementation/command'
import * as p_s from 'pareto-core/implementation/serializer'
import * as p_temp from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-execute-sandboxed/commands/interfaces"

//dependencies
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"

export const $$: p_.Command_Implementation<
    command_interfaces.npm,
    null,
    null,
    {
        'npm': command_interfaces_pareto_resources.command_executable
    }
> = p_.command(
    ($d, $s, $q, $c) => [
        $c['npm'].execute(
            {
                'working directory': p_.literal.not_set(),
                'args': p_.literal.segmented_list([
                    p_temp.from.optional($d.path).decide(
                        ($) => p_.literal.list([
                            "--prefix",
                            ser_path.Context_Path($)
                        ]),
                        () => p_.literal.list([])
                    ),
                    p_temp.from.state($d.operation).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'update': return p_temp.option($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "update",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'install': return p_temp.option($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "install",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'version': return p_temp.option($, ($) => p_.literal.list([
                                    "version",
                                    p_temp.from.state($).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'patch': return p_temp.option($, ($) => "patch")
                                                case 'minor': return p_temp.option($, ($) => "minor")
                                                default: return p_temp.exhaustive($[0])
                                            }
                                        })
                                ]))
                                default: return p_temp.exhaustive($[0])
                            }
                        })
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)