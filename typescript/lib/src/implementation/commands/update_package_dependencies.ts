import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import p_variables from 'pareto-core/implementation/command/specials/variables'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as interface_ from "../../declarations/commands.js"

//data types
import * as d from "../../interface/data/update_package_dependencies.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: interface_.update_package_dependencies = p_.command(
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
