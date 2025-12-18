import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'
import * as _et from 'exupery-core-types'

import * as d from "../../interface/commands/set_up_comparison_against_published"

import * as d_npm_package from "../refiners/npm_package/temp"
import { extend_path, create_node_path } from "exupery-resources/dist/implementation/transformers/path/path"


// import { $$ as op_trim } from "pareto-standard-operations/dist/implementation/algorithms/operations/impure/text/trim"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

import { $$ as r_parse_npm_package } from "../refiners/npm_package/temp"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"
import * as r_context_path from "exupery-resources/dist/implementation/refiners/context_path/text"

const remove_n_characters_from_end = ($: string, n: number): string => {

    const chars = _ea.text_to_character_list($)
    const length = chars.__get_number_of_elements()
    const new_length = length - n
    let index = -1

    return _ea.build_text(($i) => {
        chars.__for_each(($) => {
            index += 1
            if (index < new_length) {
                $i['add character']($)
            }
        })
    })
}

// export type Variables = {
//     'version': string
// }

export const $$: d.Signature = _easync.create_command_procedure(
    ($p, $cr, $qr) => {

        return [
            _easync.p.query_without_error_transformation<d.Error, d_npm_package.NPM_Package>(
                $qr['read file'](
                    {
                        'path': t_path_to_path.create_node_path($p['path to local package'], `package.json`),
                        'escape spaces in path': true,
                    },
                    ($): d.Error => ['error while reading package.json', $],
                ).refine(
                    ($) => _ea.create_refinement_context<d_npm_package.NPM_Package, d_npm_package.NPM_Package_Parse_Error>(
                        (abort) => r_parse_npm_package(
                            $,
                            abort,
                        )
                    ),
                    ($): d.Error => {
                        return ['error while parsing package.json', "HMMM"]
                    }
                ),
                ($v) => {
                    const package_info = $v
                    const filename = `${$v.name}-${$v.version}.tgz`;
                    return [

                        $cr['remove'].execute(
                            {
                                'path': {
                                    'escape spaces in path': true,
                                    'path': $p['path to output published directory']
                                },
                                'error if not exists': false,
                            },
                            ($) => ['error while removing directory', $],
                        ),

                        $cr['remove'].execute(
                            {
                                'path': {
                                    'escape spaces in path': true,
                                    'path': $p['path to output local directory']
                                },
                                'error if not exists': false,
                            },
                            ($) => ['error while removing directory', $],
                        ),

                        // Create main output directory
                        $cr['make directory'].execute(
                            {
                                'path': $p['path to output published directory'],
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),
                        // Create main output directory
                        $cr['make directory'].execute(
                            {
                                'path': $p['path to output local directory'],
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),
                        // Create main output directory
                        $cr['make directory'].execute(
                            {
                                'path': $p['path to temp directory'],
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        // Create local package using npm pack (if local package path provided)
                        $cr['npm'].execute(
                            {
                                'args': op_flatten(_ea.list_literal([
                                    _ea.list_literal([
                                        `pack`,
                                        t_path_to_text.Context_Path($p['path to local package']),
                                        `--pack-destination`,
                                        t_path_to_text.Node_Path($p['path to temp directory']),
                                    ])
                                ])),
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create local subdirectory
                        $cr['make directory'].execute(
                            {
                                'path': $p['path to output local directory'],
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        // Extract local package into local subdirectory using dynamic filename
                        $cr['tar'].execute(
                            {
                                'args': _ea.list_literal([
                                    `-xzmf`,
                                    `${t_path_to_text.Node_Path($p['path to temp directory'])}/${filename}`,
                                    `-C`,
                                    t_path_to_text.Node_Path($p['path to output local directory']),
                                    `--strip-components=1`,
                                ]),
                            },
                            ($) => ['error while running tar', $],
                        ),

                        // Download published package using dynamic package name and version
                        $cr['make directory'].execute(
                            {
                                'path': create_node_path(extend_path($p['path to temp directory'].context, _ea.list_literal([$p['path to temp directory'].node])), `npm`),
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        $cr['npm'].execute(
                            {
                                'args': _ea.list_literal([
                                    `pack`,
                                    `${package_info.name}@${package_info.version}`,
                                    `--pack-destination`,
                                    `${t_path_to_text.Node_Path($p['path to temp directory'])}/npm`,
                                ])
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create published subdirectory
                        $cr['make directory'].execute(
                            {
                                'path': $p['path to output published directory'],
                                'escape spaces in path': true,
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        _easync.p.query_without_error_transformation<d.Error, string>(
                            $qr.npm(
                                {
                                    'args': _ea.list_literal([
                                        `view`,
                                        package_info.name,
                                        `version`,
                                    ]),
                                },
                                ($): d.Error => ['error while running npm query', $]
                            ).transform_result(($) => remove_n_characters_from_end($.stdout, 1)),
                            // Extract published package into published subdirectory
                            ($v) => [
                                $cr['tar'].execute<d.Error>(
                                    {
                                        'args': _ea.list_literal([
                                            `-xzmf`,
                                            `${t_path_to_text.Node_Path($p['path to temp directory'])}/npm/${package_info.name}-${$v}.tgz`,
                                            `-C`,
                                            `${t_path_to_text.Node_Path($p['path to output published directory'])}`,
                                            `--strip-components=1`,
                                        ])
                                    },
                                    ($): d.Error => ['error while running tar', $],
                                )
                            ]
                        ),
                    ]
                }
            ),
        ]
    }
)