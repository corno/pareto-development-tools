import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _ed from 'exupery-core-dev'

import * as d from "../../interface/commands/api"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import { extend_path, create_node_path } from "exupery-resources/dist/implementation/transformers/path/path"

import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

import * as temp_r_node_path from "exupery-resources/dist/implementation/refiners/node_path/text"

// import * as r_instruction from "../refiners/instruction/refiners"


// export type Variables = {
//     'file content': string
// }

const node_path_to_context_path = ($: d_path.Node_Path): d_path.Context_Path => {
    return {
        'start': $.context.start,
        'subpath': _ea.build_list(($i) => {
            $.context.subpath.__for_each(($) => {
                $i['add element']($)
            })
            $i['add element']($.node)
        }),
    }
}

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr, $qr) => _ea.cc($p, ($) => {
        switch ($[0]) {
            case 'assert clean': return _ea.ss($, ($) => [
                $cr['git assert clean'].execute(
                    {
                        'path': _ea.set($['path to package'])
                    },
                    ($): d.Error => ['git assert clean', $],
                )
            ])
            case 'project': return _ea.ss($, ($) => {
                const path_to_project = $['path to project']
                return [
                    _easync.p.dictionary.deprecated_parallel.query(
                        $qr['read directory'](
                            {
                                'path': {
                                    'escape spaces in path': true,
                                    'path': `${t_path_to_text.Context_Path($['path to project'])}/packages`,
                                },
                            },
                            ($): d.Error => ['project', ['could not read packages directory', $]],
                        ),
                        ($x, key): _et.Command_Promise<d.Project_Package_Error>[] => _ea.cc($.instruction, ($) => {
                            const concatenated_path = node_path_to_context_path( temp_r_node_path.Node_Path(
                                $x['concatenated path'],
                                { 'pedantic': true },
                                ($) => _ea.deprecated_panic(`invalid path`)
                            ))
                            switch ($[0]) {
                                case 'assert clean': return _ea.ss($, ($) => [
                                    $cr['git assert clean'].execute(
                                        {
                                            'path': _ea.set($x['concatenated path'])
                                        },
                                        ($): d.Project_Package_Error => ['git assert clean', $],
                                    )
                                ])
                                case 'build': return _ea.ss($, ($) => [
                                    $cr['build'].execute(
                                        {
                                            'path': $x['concatenated path']
                                        },
                                        ($): d.Project_Package_Error => ['build', $],
                                    )
                                ])
                                case 'build and test': return _ea.ss($, ($) => [
                                    $cr['build and test'].execute(
                                        {
                                            'path': $x['concatenated path']
                                        },
                                        ($): d.Project_Package_Error => ['build and test', $],
                                    )
                                ])
                                case 'git extended commit': return _ea.ss($, ($) => [
                                    $cr['git extended commit'].execute(
                                        {
                                            'path': _ea.set($x['concatenated path']),
                                            'instruction': $
                                        },
                                        ($): d.Project_Package_Error => ['git commit', $],
                                    )
                                ])
                                case 'git remove tracked but ignored': return _ea.ss($, ($) => [
                                    $cr['git remove tracked but ignored'].execute(
                                        {
                                            'path': _ea.set($x['concatenated path'])
                                        },
                                        ($): d.Project_Package_Error => ['git remove tracked but ignored', $],
                                    )
                                ])
                                case 'set up comparison': return _ea.ss($, ($): _et.Command_Promise<d.Project_Package_Error>[] => [
                                    $cr['set up comparison against published'].execute(
                                        {
                                            'path to local package': extend_path(concatenated_path, _ea.list_literal([`pub`])),
                                            'path to output local directory': create_node_path(extend_path(path_to_project, _ea.list_literal([`temp`, `local`])), key),
                                            'path to output published directory': create_node_path(extend_path(path_to_project, _ea.list_literal([`temp`, `published`])), key),
                                            'path to temp directory': create_node_path(extend_path(path_to_project, _ea.list_literal([`temp`, `temp`])), key),
                                        },
                                        ($): d.Project_Package_Error => ['set up comparison', $],
                                    )
                                ])
                                case 'update dependencies': return _ea.ss($, ($) => [
                                    $cr['update dependencies'].execute(
                                        {
                                            'path': $x['concatenated path']
                                        },
                                        ($): d.Project_Package_Error => ['update dependencies', $],
                                    )
                                ])
                                default: return _ea.au($[0])
                            }
                        }),
                        ($) => ['project', ['packages', $]]
                    )
                ]
            })
            case 'set up comparison': return _ea.ss($, ($) => [
                $cr['set up comparison against published'].execute(
                    {
                        'path to local package': extend_path($['path to package'], _ea.list_literal(['pub'])),
                        'path to output local directory': create_node_path(extend_path($['path to package'], _ea.list_literal([`temp`, ])), `local`),
                        'path to output published directory': create_node_path(extend_path($['path to package'], _ea.list_literal([`temp`, ])), `published`),
                        'path to temp directory': create_node_path(extend_path($['path to package'], _ea.list_literal([`temp`, ])), `temp`),
                    },
                    ($): d.Error => ['set up comparison', $],
                )
            ])
            default: return _ea.au($[0])
        }
    })
)
