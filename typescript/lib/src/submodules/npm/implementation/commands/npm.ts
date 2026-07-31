import * as p_ from 'pareto-core/implementation/command'
import * as p_s from 'pareto-core/implementation/serializer'
import * as p_temp from 'pareto-core/implementation/transformer'

//interface dependencies
import type * as command_interfaces from "../../commands/interfaces.js"
import type * as command_interfaces_pareto_resources from "pareto-resources/commands/interfaces"

//dependencies
import * as ser_path from "pareto-resources/implementation/serializers/unrestricted_path"

export const $$: p_.Command_Implementation<
    command_interfaces.npm,
    null,
    null,
    {
        'npm': command_interfaces_pareto_resources.execute_sandboxed.command_executable
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
                                case 'update': return p_temp.ss($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "update",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'install': return p_temp.ss($, ($) => p_.literal.segmented_list([
                                    p_.literal.list([
                                        "install",
                                    ]),
                                    $['package-lock only']
                                        ? p_.literal.list(["--package-lock-only"])
                                        : p_.literal.list([])

                                ]))
                                case 'version': return p_temp.ss($, ($) => p_.literal.list([
                                    "version",
                                    p_temp.from.state($).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'patch': return p_temp.ss($, ($) => "patch")
                                                case 'minor': return p_temp.ss($, ($) => "minor")
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