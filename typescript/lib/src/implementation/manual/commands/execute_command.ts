import * as pt from 'pareto-core/dist/command'
import * as pci from 'pareto-core/dist/command_interface'


import p_change_context from 'pareto-core/dist/_p_change_context'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/execute_command"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"


export const $$: signatures.procedures.api = pt.command_procedure(
    ($d, $s, $q, $c) => [
        pt.decide.state($d.type, ($) => {
            switch ($[0]) {
                case 'all packages': return pt.ss($, ($) => {
                    const path_to_project = $['path to project']
                    // _pdev.
                    return pt.dictionaryx.deprecated_parallel.query(
                        $q['read directory'](
                            {
                                'path': t_path_to_path.extend_context_path_with_single_step(
                                    $['path to project'],
                                    { 'addition': "packages" }
                                )
                            },
                            ($): d.Error => ['all', ['could not read packages directory', $]],
                        ),
                        ($xx, id): pci.Command_Promise<d.All__Package_Error>[] => [
                            pt.decide.state($.instruction, ($) => {
                                const context_path = t_path_to_path.deprecated_node_path_to_context_path($xx.path)
                                switch ($[0]) {
                                    case 'assert clean': return pt.ss($, ($) => $c['git assert is clean'].execute(
                                        {
                                            'path': pt.optional.literal.set(context_path)
                                        },
                                        ($): d.All__Package_Error => ['git assert clean', $],
                                    ))
                                    case 'build': return pt.ss($, ($) => $c['build'].execute(
                                        {
                                            'path': context_path,
                                        },
                                        ($): d.All__Package_Error => ['build', $],
                                    ))
                                    case 'build and test': return pt.ss($, ($x) => $c['build and test'].execute(
                                        {
                                            'path': context_path,
                                        },
                                        ($): d.All__Package_Error => ['build and test', {
                                            'error': $,
                                            'concise': $x.concise
                                        }],
                                    ))
                                    case 'git commit': return pt.ss($, ($) => $c['git commit'].execute(
                                        {
                                            'path': context_path,
                                            'instruction': $,
                                        },
                                        ($): d.All__Package_Error => ['git commit', $],
                                    ))
                                    case 'git remove tracked but ignored': return pt.ss($, ($) => $c['git remove tracked but ignored'].execute(
                                        {
                                            'path': pt.optional.literal.set(context_path)
                                        },
                                        ($): d.All__Package_Error => ['git remove tracked but ignored', $],
                                    ))
                                    case 'set up comparison': return pt.ss($, ($): pci.Command_Promise<d.All__Package_Error> => {

                                        const path_to_temp = t_path_to_path.extend_context_path_with_single_step(
                                            t_path_to_path.extend_context_path_with_single_step(
                                                path_to_project,
                                                { 'addition': "temp" }
                                            ),
                                            { 'addition': "comparison" }
                                        )
                                        return $c['npm set up comparison against published'].execute(
                                            {
                                                'path to local package': t_path_to_path.extend_context_path_with_list(context_path, { 'addition': pt.list.literal(["typescript", "lib"]) }),
                                                'path to output local directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "local" }), { 'node': id }),
                                                'path to output published directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "published" }), { 'node': id }),
                                                'path to temp directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path_with_single_step(path_to_temp, { 'addition': "temp" }), { 'node': id }),
                                            },
                                            ($): d.All__Package_Error => ['set up comparison', $],
                                        )
                                    })
                                    case 'update package dependencies': return pt.ss($, ($) => $c['update package dependencies'].execute(
                                        {
                                            'path': context_path
                                        },
                                        ($): d.All__Package_Error => ['update dependencies', $],
                                    ))
                                    default: return pt.au($[0])
                                }
                            })
                        ],
                        ($) => ['all', ['packages', $]]
                    )
                })
                case 'package': return pt.ss($, ($) => {
                    const path = $.path
                    return pt.decide.state($.instruction, ($) => {
                        switch ($[0]) {
                            case 'assert clean': return pt.ss($, ($) => $c['git assert is clean'].execute(
                                {
                                    'path': pt.optional.literal.set(path)
                                },
                                ($): d.Error => ['package', ['git assert clean', $]],
                            ))
                            case 'build and test': return pt.ss($, ($) => $c['build and test'].execute(
                                {
                                    'path': path,
                                },
                                ($): d.Error => ['package', ['build and test', {
                                    'error': $,
                                    'concise': false,
                                }]],
                            ))
                            case 'git commit': return pt.ss($, ($) => $c['git commit'].execute(
                                {
                                    'path': path,
                                    'instruction': $,
                                },
                                ($): d.Error => ['package', ['git commit', $]],
                            ))
                            case 'update package dependencies': return pt.ss($, ($) => $c['update package dependencies'].execute(
                                {
                                    'path': path
                                },
                                ($): d.Error => ['package', ['update dependencies', $]],
                            ))
                            default: return pt.au($[0])
                        }
                    })
                })
                case 'project': return pt.ss($, ($) => {
                    const path = $.path
                    return pt.decide.state($.instruction, ($) => {
                        switch ($[0]) {
                            case 'analyze file structure': return pt.ss($, ($) => $c['analyze file structure'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['get project files', $],
                            ))
                            case 'dependency graph': return pt.ss($, ($) => $c['create dependency graph'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['dependency graph', $],
                            ))
                            case 'list file structure problems': return pt.ss($, ($) => $c['list file structure problems'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['get project files', $],
                            ))

                            default: return pt.au($[0])
                        }
                    })
                })
                case 'publish': return pt.ss($, ($) => $c['publish'].execute(
                    $,
                    ($): d.Error => ['package', ['publish', $]],
                ))
                case 'set up comparison': return pt.ss($, ($) => p_change_context(
                    {
                        'path to temp': t_path_to_path.extend_context_path_with_single_step($['path to package'], { 'addition': "temp" }),
                        'path to package': $['path to package'],
                    },
                    ($) => $c['npm set up comparison against published'].execute(
                        {
                            'path to local package': t_path_to_path.extend_context_path_with_list($['path to package'], { 'addition': pt.list.literal(["typescript", "lib"]) }),
                            'path to output local directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "local" }),
                            'path to output published directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "published" }),
                            'path to temp directory': t_path_to_path.create_node_path($['path to temp'], { 'node': "temp" }),
                        },
                        ($): d.Error => ['set up comparison', $],
                    )
                ))
                default: return pt.au($[0])
            }
        })
    ]
)
