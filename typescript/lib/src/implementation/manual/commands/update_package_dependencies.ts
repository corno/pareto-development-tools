import * as _pc from 'pareto-core/dist/command'
import * as pt from 'pareto-core/dist/assign'
import p_variables from 'pareto-core/dist/_p_variables'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/update_package_dependencies"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: signatures.procedures.update_package_dependencies = _pc.command_procedure(
    ($d, $s, $q, $c) => p_variables(
        () => {
            const typescript_path = t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "typescript" })
            return [

                // update dependencies of lib
                $c['npm update package dependencies'].execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["lib"]) }),
                    },
                    ($): d.Error => ['error updating lib', $],
                ),

                // update dependencies of test
                $c['npm update package dependencies'].execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["test"]) }),
                    },
                    ($) => ['error updating test', $],
                ),

                _pc.if_.query(
                    $q.stat(
                        t_path_to_path.create_node_path(
                            typescript_path,
                            {
                                'node': "app"
                            }
                        ),
                        ($): d.Error => ['error statting app dir', $]
                    ).transform(($) => pt.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'does not exist': return pt.ss($, ($) => false)
                            case 'file': return pt.ss($, ($) => false)
                            case 'directory': return pt.ss($, ($) => true)
                            default: return pt.au($[0])
                        }
                    })),
                    [

                        // update dependencies of app
                        $c['npm update package dependencies'].execute(
                            {
                                'path': t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["app"]) }),
                            },
                            ($) => ['error updating app', $],
                        ),

                    ]
                )
            ]
        }
    )
)
