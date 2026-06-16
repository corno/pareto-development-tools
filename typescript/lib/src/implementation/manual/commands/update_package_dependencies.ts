import * as p_ from 'pareto-core/dist/implementation/command'
import * as p_temp from 'pareto-core/dist/implementation/transformer'
import p_variables from 'pareto-core/dist/implementation/specials/variables'
import p_super_query_result from 'pareto-core/dist/implementation/query/super_query_result'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../interface/data/update_package_dependencies"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: interface_.procedures.update_package_dependencies = p_.command_procedure(
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

                p_.s.if_.query_deprecated(
                    p_super_query_result($q.stat(
                        t_path_to_path.create_node_path(
                            typescript_path,
                            {
                                'node': "app"
                            }
                        ),
                        ($): d.Error => ['error statting app dir', $]
                    )).transform(($) => p_temp.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'does not exist': return p_temp.ss($, ($) => false)
                            case 'file': return p_temp.ss($, ($) => false)
                            case 'directory': return p_temp.ss($, ($) => true)
                            default: return p_temp.au($[0])
                        }
                    })),
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
        }
    )
)
