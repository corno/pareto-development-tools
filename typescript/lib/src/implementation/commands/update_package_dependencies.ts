import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import p_variables from 'pareto-core/implementation/command/specials/variables'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

//interface dependencies
import type * as command_interfaces from "../../commands/interfaces.js"
import type * as command_interfaces_npm from "../../submodules/npm/commands/interfaces.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"

//schemas
import * as d from "../../schemas/update_package_dependencies.js"

//dependencies
import * as t_path_to_path from "pareto-resources/schemas/fs_unrestricted_path/transformers/unrestricted_path"

export const $$: p_.Command_Implementation<
    command_interfaces.update_package_dependencies,
    null,
    {
        'stat': query_interfaces_pareto_filesystem_unrestricted_api.stat_possible_node
    },
    {
        'npm update package dependencies': command_interfaces_npm.update_package_dependencies
    }
> = p_.command(
    ($d, $s, $q, $c) => p_variables(
        () => {
            const typescript_path = t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "typescript" })
            return [

                // update dependencies of lib
                $c['npm update package dependencies'].execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["lib"]) }),
                    },
                    ($): d.Error => ['error updating lib', $],
                ),

                // update dependencies of test
                $c['npm update package dependencies'].execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["test"]) }),
                    },
                    ($) => ['error updating test', $],
                ),

                p_.s.query(
                    p_super_query_result($q.stat(
                        t_path_to_path.create_node_path(
                            typescript_path,
                            {
                                'node': "app"
                            }
                        ),
                        ($): d.Error => ['error statting app dir', $]
                    )),
                    ($) => [

                        p_.s.if_(//validate that the app dir exists, and is a directory
                            p_temp.from.state($).decide(
                                ($): boolean => {
                                    switch ($[0]) {
                                        case 'does not exist': return p_temp.ss($, ($) => false)
                                        case 'file': return p_temp.ss($, ($) => false)
                                        case 'directory': return p_temp.ss($, ($) => true)
                                        default: return p_temp.exhaustive($[0])
                                    }
                                }),
                            [

                                // update dependencies of app
                                $c['npm update package dependencies'].execute(
                                    {
                                        'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["app"]) }),
                                    },
                                    ($) => ['error updating app', $],
                                ),

                            ]
                        )

                    ]
                ),
            ]
        }
    )
)
