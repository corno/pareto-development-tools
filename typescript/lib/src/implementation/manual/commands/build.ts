import * as p_ from 'pareto-core/dist/command'
import * as p_t from 'pareto-core/dist/assign'
import p_variables from 'pareto-core/dist/_p_variables'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/build"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: signatures.procedures.build = p_.command_procedure(
    ($d, $s, $q, $c) => p_variables(
        () => {
            const typescript_path = t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "typescript" })
            return [
                $c.remove.execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': p_.list.literal(["lib", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing lib dist dir', { 'path': $d.path, 'error': $ }],
                ),
                $c.tsc.execute(
                    {
                        'path': p_.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.list.literal(["lib"]) })),
                    },
                    ($): d.Error => ['error building lib', {
                        'path': $d.path,
                        'error': $,
                    }],
                ),
                $c.remove.execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': p_.list.literal(["test", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing test dist dir', { 'path': $d.path, 'error': $ }],
                ),
                $c.tsc.execute(
                    {
                        'path': p_.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.list.literal(["test"]) })),
                    },
                    ($): d.Error => ['error building test', {
                        'path': $d.path,
                        'error': $,
                    }],
                ),



                p_.if_.query(
                    $q.stat(
                        t_path_to_path.create_node_path(
                            typescript_path,
                            {
                                'node': "app"
                            }
                        ),
                        ($): d.Error => ['error statting app dir', $]
                    ).transform(($) => p_t.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'does not exist': return p_t.ss($, ($) => false)
                            case 'file': return p_t.ss($, ($) => false)
                            case 'directory': return p_t.ss($, ($) => true)
                            default: return p_t.au($[0])
                        }
                    })),
                    p_variables(() => {
                        const dist_path = t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': p_.list.literal(["app", "dist"]),
                            }
                        )
                        return [

                            $c.remove.execute(
                                {
                                    'path': dist_path,
                                    'error if not exists': false,
                                },
                                ($): d.Error => ['error removing app dist dir', { 'path': $d.path, 'error': $ }],
                            ),
                            $c.tsc.execute(
                                {
                                    'path': p_.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.list.literal(["app"]) })),
                                },
                                ($): d.Error => ['error building app', {
                                    'path': $d.path,
                                    'error': $,
                                }],
                            ),

                            $c.chmod.execute(
                                {
                                    'path': t_path_to_path.create_node_path(
                                        dist_path,
                                        {
                                            'node': "bin.js"
                                        }
                                    ),
                                    'mode': {
                                        'special bits': p_t.optional.literal.not_set(),
                                        'owner': {
                                            'read': true,
                                            'write': true,
                                            'execute': true,
                                        },
                                        'group': {
                                            'read': true,
                                            'write': false,
                                            'execute': true,
                                        },
                                        'others': {
                                            'read': true,
                                            'write': false,
                                            'execute': true,
                                        },
                                    },
                                },
                                ($): d.Error => ['error setting permissions on app dist bin.js', {
                                    'path': dist_path,
                                    'error': $
                                }],
                            )

                        ]
                    })
                )
            ]
        }
    )
)
