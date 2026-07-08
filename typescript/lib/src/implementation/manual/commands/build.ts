import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import p_variables from 'pareto-core/implementation/command/specials/variables'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import * as interface_ from "../../../interface/declarations/commands.js"

//data types
import * as d from "../../../interface/data/build.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"

export const $$: interface_.build = p_.command(
    ($d, $s, $q, $c) => p_variables(
        () => {
            const typescript_path = t_path_to_path.extend_context_path_with_single_step($d.path, { 'addition': "typescript" })
            return [
                $c.remove.execute(
                    {
                        'path': t_path_to_path.extend_context_path_with_list(
                            typescript_path,
                            {
                                'addition': p_.literal.list(["lib", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing lib dist dir', { 'path': $d.path, 'error': $ }],
                ),
                $c.tsc.execute(
                    {
                        'path': p_.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["lib"]) })),
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
                                'addition': p_.literal.list(["test", "dist"]),
                            }
                        ),
                        'error if not exists': false,
                    },
                    ($): d.Error => ['error removing test dist dir', { 'path': $d.path, 'error': $ }],
                ),
                $c.tsc.execute(
                    {
                        'path': p_.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["test"]) })),
                    },
                    ($): d.Error => ['error building test', {
                        'path': $d.path,
                        'error': $,
                    }],
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

                        p_.s.if_(
                            p_temp.from.state($).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'does not exist': return p_temp.ss($, ($) => false)
                                        case 'file': return p_temp.ss($, ($) => false)
                                        case 'directory': return p_temp.ss($, ($) => true)
                                        default: return p_temp.au($[0])
                                    }
                                }),
                            p_variables(
                                () => {
                                    const dist_path = t_path_to_path.extend_context_path_with_list(
                                        typescript_path,
                                        {
                                            'addition': p_.literal.list(["app", "dist"]),
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
                                                'path': p_.literal.set(t_path_to_path.extend_context_path_with_list(typescript_path, { 'addition': p_.literal.list(["app"]) })),
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
                                                    'special bits': p_.literal.not_set(),
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
                ),
            ]
        }
    )
)
