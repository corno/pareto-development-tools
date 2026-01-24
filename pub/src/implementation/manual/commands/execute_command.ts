import * as _p from 'pareto-core/dist/command'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/execute_command"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"


export const $$: signatures.commands.api = _p.command_procedure(
    ($p, $cr, $qr) => _p.decide.state($p, ($) => {
        switch ($[0]) {
            case 'all packages': return _p.ss($, ($) => {
                const path_to_project = $['path to project']
                const path_to_temp = t_path_to_path.extend_context_path(
                    t_path_to_path.extend_context_path(
                        $['path to project'],
                        { 'addition': `temp` }
                    ),
                    { 'addition': `comparison` }
                )
                return [
                    _p.dictionaryx.deprecated_parallel.query(
                        $qr['read directory'](
                            {
                                'path': t_path_to_path.create_node_path(
                                    path_to_project,
                                    `packages`
                                )
                            },
                            ($): d.Error => ['all', ['could not read packages directory', $]],
                        ),
                        ($x, key_spaces_not_escaped): _pi.Command_Promise<d.All__Package_Error>[] => _p.decide.state($.instruction, ($) => {
                            const concatenated_path = $x.path
                            const context_path = t_path_to_path.deprecated_node_path_to_context_path(concatenated_path)
                            switch ($[0]) {
                                case 'assert clean': return _p.ss($, ($) => [
                                    $cr['git assert is clean'].execute(
                                        {
                                            'path': _p.optional.set(context_path)
                                        },
                                        ($): d.All__Package_Error => ['git assert clean', $],
                                    )
                                ])
                                case 'build': return _p.ss($, ($) => [
                                    $cr['build'].execute(
                                        {
                                            'path': context_path,
                                        },
                                        ($): d.All__Package_Error => ['build', $],
                                    )
                                ])
                                case 'build and test': return _p.ss($, ($x) => [
                                    $cr['build and test'].execute(
                                        {
                                            'path': context_path,
                                        },
                                        ($): d.All__Package_Error => ['build and test', {
                                            'error': $,
                                            'concise': $x.concise
                                        }],
                                    )
                                ])
                                case 'git extended commit': return _p.ss($, ($) => [
                                    $cr['git extended commit'].execute(
                                        {
                                            'path': _p.optional.set(context_path),
                                            'instruction': $
                                        },
                                        ($): d.All__Package_Error => ['git commit', $],
                                    )
                                ])
                                case 'git remove tracked but ignored': return _p.ss($, ($) => [
                                    $cr['git remove tracked but ignored'].execute(
                                        {
                                            'path': _p.optional.set(context_path)
                                        },
                                        ($): d.All__Package_Error => ['git remove tracked but ignored', $],
                                    )
                                ])
                                case 'set up comparison': return _p.ss($, ($): _pi.Command_Promise<d.All__Package_Error>[] => [
                                    $cr['npm set up comparison against published'].execute(
                                        {
                                            'path to local package': t_path_to_path.extend_context_path(t_path_to_path.deprecated_node_path_to_context_path(concatenated_path), { 'addition': `pub` }),
                                            'path to output local directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path(path_to_temp, { 'addition': `local` }), key_spaces_not_escaped),
                                            'path to output published directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path(path_to_temp, { 'addition': `published` }), key_spaces_not_escaped),
                                            'path to temp directory': t_path_to_path.create_node_path(t_path_to_path.extend_context_path(path_to_temp, { 'addition': `temp` }), key_spaces_not_escaped),
                                        },
                                        ($): d.All__Package_Error => ['set up comparison', $],
                                    )
                                ])
                                case 'update package dependencies': return _p.ss($, ($) => [
                                    $cr['update package dependencies'].execute(
                                        {
                                            'path': context_path
                                        },
                                        ($): d.All__Package_Error => ['update dependencies', $],
                                    )
                                ])
                                default: return _p.au($[0])
                            }
                        }),
                        ($) => ['all', ['packages', $]]
                    )
                ]
            })
            case 'package': return _p.ss($, ($) => {
                const path = $.path
                return _p.decide.state($.instruction, ($) => {
                    switch ($[0]) {
                        case 'assert clean': return _p.ss($, ($) => [
                            $cr['git assert is clean'].execute(
                                {
                                    'path': _p.optional.set(path)
                                },
                                ($): d.Error => ['package', ['git assert clean', $]],
                            )
                        ])
                        case 'build and test': return _p.ss($, ($) => [
                            $cr['build and test'].execute(
                                {
                                    'path': path,
                                },
                                ($): d.Error => ['package', ['build and test', {
                                    'error': $,
                                    'concise': false,
                                }]],
                            )
                        ])
                        case 'git extended commit': return _p.ss($, ($) => [
                            $cr['git extended commit'].execute(
                                {
                                    'path': _p.optional.set(path),
                                    'instruction': $
                                },
                                ($): d.Error => ['package', ['git commit', $]],
                            )
                        ])
                        case 'update package dependencies': return _p.ss($, ($) => [
                            $cr['update package dependencies'].execute(
                                {
                                    'path': path
                                },
                                ($): d.Error => ['package', ['update dependencies', $]],
                            )
                        ])
                        default: return _p.au($[0])
                    }
                })
            })
            case 'project': return _p.ss($, ($) => {
                const path = $.path
                return _p.decide.state($.instruction, ($) => {
                    switch ($[0]) {
                        case 'analyze file structure': return _p.ss($, ($) => [
                            $cr['analyze file structure'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['analyze file structure', $],
                            )
                        ])
                        case 'dependency graph': return _p.ss($, ($) => [
                            $cr['create dependency graph'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['dependency graph', $],
                            )
                        ])
                        case 'list file structure problems': return _p.ss($, ($) => [
                            $cr['list file structure problems'].execute(
                                {
                                    'path to project': path
                                },
                                ($): d.Error => ['analyze file structure', $],
                            )
                        ])

                        default: return _p.au($[0])
                    }
                })
            })
            case 'publish': return _p.ss($, ($) => [
                $cr['publish'].execute(
                    $,
                    ($): d.Error => ['package', ['publish', $]],
                )
            ])
            case 'set up comparison': return _p.ss($, ($) => _p.deprecated_cc(
                {
                    'path to temp': t_path_to_path.extend_context_path($['path to package'], { 'addition': `temp` }),
                    'path to package': $['path to package'],
                },
                ($) => [
                    $cr['npm set up comparison against published'].execute(
                        {
                            'path to local package': t_path_to_path.extend_context_path($['path to package'], { 'addition': `pub` }),
                            'path to output local directory': t_path_to_path.create_node_path($['path to temp'], `local`),
                            'path to output published directory': t_path_to_path.create_node_path($['path to temp'], `published`),
                            'path to temp directory': t_path_to_path.create_node_path($['path to temp'], `temp`),
                        },
                        ($): d.Error => ['set up comparison', $],
                    )
                ]
            ))
            default: return _p.au($[0])
        }
    })
)
