import * as _pc from 'pareto-core/dist/command'
import * as _p from 'pareto-core/dist/assign'
import _p_variables from 'pareto-core/dist/_p_variables'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/build"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/path/path"

export const $$: signatures.commands.build = _pc.command_procedure(
    ($p, $cr, $q) => _p_variables(
        () => {
            const typescript_path = t_path_to_path.extend_context_path_with_single_step($p.path, { 'addition': "typescript" })
            return [
                $cr.remove.execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': _pc.list.literal(["lib", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing lib dist dir', { 'path': $p.path, 'error': $ }],
                ),
                $cr.tsc.execute(
                    {
                        'path': _pc.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["lib"]) })),
                    },
                    ($): d.Error => ['error building lib', {
                        'path': $p.path,
                        'error': $,
                    }],
                ),
                $cr.remove.execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': _pc.list.literal(["test", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing test dist dir', { 'path': $p.path, 'error': $ }],
                ),
                $cr.tsc.execute(
                    {
                        'path': _pc.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["test"]) })),
                    },
                    ($): d.Error => ['error building test', {
                        'path': $p.path,
                        'error': $,
                    }],
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
                    ).transform(($) => _pc.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'does not exist': return _pc.ss($, ($) => false)
                            case 'file': return _pc.ss($, ($) => false)
                            case 'directory': return _pc.ss($, ($) => true)
                            default: return _pc.au($[0])
                        }
                    })),
                    _p_variables(() => {
                        const dist_path = t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': _pc.list.literal(["app", "dist"]),
                            }
                        )
                        return [

                            $cr.remove.execute(
                                {
                                    'path': dist_path,
                                    'error if not exists': false,
                                },
                                ($): d.Error => ['error removing app dist dir', { 'path': $p.path, 'error': $ }],
                            ),
                            $cr.tsc.execute(
                                {
                                    'path': _pc.optional.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': _pc.list.literal(["app"]) })),
                                },
                                ($): d.Error => ['error building app', {
                                    'path': $p.path,
                                    'error': $,
                                }],
                            ),

                            $cr.chmod.execute(
                                {
                                    'path': t_path_to_path.create_node_path(
                                        dist_path,
                                        {
                                            'node': "bin.js"
                                        }
                                    ),
                                    'mode': {
                                        'special bits': _p.optional.literal.not_set(),
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
