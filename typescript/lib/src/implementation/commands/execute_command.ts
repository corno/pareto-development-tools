import * as p_ from 'pareto-core/implementation/command'


import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

import type * as interface_ from "../../declarations/commands.js"

//data types
import * as d from "../../interface/schemas/execute_command.js"

//dependencies
import * as t_path_to_path from "pareto-resources/implementation/transformers/unrestricted_path/unrestricted_path"


export const $$: interface_.api = p_.command(
    ($d, $s, $q, $c) => [
        p_.decide.state($d.type, ($) => {
            switch ($[0]) {
                case 'all packages': return p_.option($, ($) => {
                    const ap = $

                    return [
                        p_.s.query(
                            $q['read directory'](
                                {
                                    'path': t_path_to_path.extend_context_path_with_single_step(
                                        $['path to project'],
                                        { 'addition': "packages" }
                                    )
                                },
                                ($): d.Error => ['all', ['could not read packages directory', $]],
                            ),
                            ($) => [
                                p_.s.dictionary(
                                    $,
                                    ($xx, id): p_.Command_Block<d.All__Package_Error> => [
                                        p_.decide.state(ap.instruction, ($) => {
                                            const context_path = t_path_to_path.deprecated_node_path_to_context_path($xx.path)
                                            switch ($[0]) {
                                                case 'assert no open changes': return p_.option($, ($) => [
                                                    $c['version control assert no open changes'].execute(
                                                        {
                                                            'path': p_.literal.set(context_path)
                                                        },
                                                        ($): d.All__Package_Error => ['version control assert no open changes', $],
                                                    )
                                                ])
                                                case 'build': return p_.option($, ($) => [
                                                    $c['build'].execute(
                                                        {
                                                            'path': context_path,
                                                        },
                                                        ($): d.All__Package_Error => ['build', $],
                                                    )
                                                ])
                                                case 'build and test': return p_.option($, ($x) => [
                                                    $c['build and test'].execute(
                                                        {
                                                            'path': context_path,
                                                        },
                                                        ($): d.All__Package_Error => ['build and test', {
                                                            'error': $,
                                                            'concise': $x.concise
                                                        }],
                                                    )
                                                ])
                                                case 'commit changes': return p_.option($, ($) => [
                                                    $c['commit changes'].execute(
                                                        {
                                                            'path': context_path,
                                                            'instruction': $,
                                                        },
                                                        ($): d.All__Package_Error => ['commit changes', $],
                                                    )
                                                ])
                                                case 'set up comparison': return p_.option($, ($): p_.Command_Block<d.All__Package_Error> => {

                                                    const path_to_temp = t_path_to_path.extend_context_path_with_single_step(
                                                        t_path_to_path.extend_context_path_with_single_step(
                                                            ap['path to project'],
                                                            { 'addition': "temp" }
                                                        ),
                                                        { 'addition': "comparison" }
                                                    )
                                                    return [
                                                        $c['npm set up comparison against published'].execute(
                                                            {
                                                                'path to local package': t_path_to_path.extend_context_path_with_list(context_path, { 'addition': p_.literal.list(["typescript", "lib"]) }),
                                                                'path to output local directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "local" }), { 'node': id }),
                                                                'path to output published directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "published" }), { 'node': id }),
                                                                'path to temp directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "temp" }), { 'node': id }),
                                                            },
                                                            ($): d.All__Package_Error => ['set up comparison', $],
                                                        )
                                                    ]
                                                })
                                                case 'update package dependencies': return p_.option($, ($) => [
                                                    $c['update package dependencies'].execute(
                                                        {
                                                            'path': context_path
                                                        },
                                                        ($): d.All__Package_Error => ['update dependencies', $],
                                                    )
                                                ])
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                    ],
                                    ($): d.Error => ['all', ['packages', $]]
                                )
                            ]
                        )
                    ]
                })
                case 'package': return p_.option($, ($) => {
                    const path = $.path
                    return [
                        p_.decide.state($.instruction, ($) => {
                            switch ($[0]) {
                                case 'assert no open changes': return p_.option($, ($) => [
                                    $c['version control assert no open changes'].execute(
                                        {
                                            'path': p_.literal.set(path)
                                        },
                                        ($): d.Error => ['package', ['version control assert no open changes', $]],
                                    )
                                ])
                                case 'build and test': return p_.option($, ($) => [
                                    $c['build and test'].execute(
                                        {
                                            'path': path,
                                        },
                                        ($): d.Error => ['package', ['build and test', {
                                            'error': $,
                                            'concise': false,
                                        }]],
                                    )
                                ])
                                case 'commit changes': return p_.option($, ($) => [
                                    $c['commit changes'].execute(
                                        {
                                            'path': path,
                                            'instruction': $,
                                        },
                                        ($): d.Error => ['package', ['commit changes', $]],
                                    )
                                ])
                                case 'update package dependencies': return p_.option($, ($) => [
                                    $c['update package dependencies'].execute(
                                        {
                                            'path': path
                                        },
                                        ($): d.Error => ['package', ['update dependencies', $]],
                                    )
                                ])
                                default: return p_.exhaustive($[0])
                            }
                        })
                    ]
                })
                case 'project': return p_.option($, ($) => {
                    const path = $.path
                    return [
                        p_.decide.state($.instruction, ($) => {
                            switch ($[0]) {
                                case 'analyze file structure': return p_.option($, ($) => [
                                    $c['analyze file structure'].execute(
                                        {
                                            'path to project': path
                                        },
                                        ($): d.Error => ['get project files', $],
                                    )
                                ])
                                case 'dependency graph': return p_.option($, ($) => [
                                    $c['create dependency graph'].execute(
                                        {
                                            'path to project': path
                                        },
                                        ($): d.Error => ['dependency graph', $],
                                    )
                                ])
                                case 'list file structure problems': return p_.option($, ($) => [
                                    $c['list file structure problems'].execute(
                                        {
                                            'path to project': path
                                        },
                                        ($): d.Error => ['get project files', $],
                                    )
                                ])

                                default: return p_.exhaustive($[0])
                            }
                        })
                    ]
                })
                case 'publish': return p_.option($, ($) => [
                    $c['publish'].execute(
                        $,
                        ($): d.Error => ['package', ['publish', $]],
                    )
                ])
                case 'set up comparison': return p_.option($, ($) => [
                    p_change_context(
                        {
                            'path to temp': t_path_to_path.extend_context_path_with_single_step($['path to package'], { 'addition': "temp" }),
                            'path to package': $['path to package'],
                        },
                        ($) => $c['npm set up comparison against published'].execute(
                            {
                                'path to local package': t_path_to_path.extend_context_path_with_list($['path to package'], { 'addition': p_.literal.list(["typescript", "lib"]) }),
                                'path to output local directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "local" }),
                                'path to output published directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "published" }),
                                'path to temp directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "temp" }),
                            },
                            ($): d.Error => ['set up comparison', $],
                        )
                    )
                ])
                default: return p_.exhaustive($[0])
            }
        })
    ]
)
