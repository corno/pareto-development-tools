import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'
import * as _et from 'exupery-core-types'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/set_up_comparison_against_published"
import * as d_npm_package from "../refiners/schemas/npm_package/temp"

//dependencies
import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/operations/pure/list/flatten"
import { $$ as r_parse_npm_package } from "../refiners/schemas/npm_package/temp"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"
// import * as ds_context_path from "exupery-resources/dist/implementation/deserializers/schemas/context_path"

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

export const $$: signatures.commands.set_up_comparison_against_published = _easync.create_command_procedure(
    ($p, $cr, $qr) => {

        return [
            _easync.p.query_without_error_transformation<d.Error, d_npm_package.NPM_Package>(
                $qr['read file'](
                    t_path_to_path.create_node_path($p['path to local package'], `package.json`),
                    ($): d.Error => ['error while reading package.json', $],
                ).deprecated_refine_old(
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
                                'path': $p['path to output published directory'],
                                'error if not exists': false,
                            },
                            ($) => ['error while removing directory', $],
                        ),

                        $cr['remove'].execute(
                            {
                                'path': $p['path to output local directory'],
                                'error if not exists': false,
                            },
                            ($) => ['error while removing directory', $],
                        ),

                        // Create main output directory
                        $cr['make directory'].execute(
                            $p['path to output published directory'],
                            ($) => ['error while creating directory', $],
                        ),
                        // Create main output directory
                        $cr['make directory'].execute(
                            $p['path to output local directory'],
                            ($) => ['error while creating directory', $],
                        ),
                        // Create main output directory
                        $cr['make directory'].execute(
                            $p['path to temp directory'],
                            ($) => ['error while creating directory', $],
                        ),

                        // Create local package using npm pack (if local package path provided)
                        $cr['npm'].execute(
                            {
                                'args': op_flatten(_ea.list_literal([
                                    _ea.list_literal([
                                        `pack`,
                                        s_path.Context_Path($p['path to local package']),
                                        `--pack-destination`,
                                        s_path.Node_Path($p['path to temp directory']),
                                    ])
                                ])),
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create local subdirectory
                        $cr['make directory'].execute(
                            $p['path to output local directory'],
                            ($) => ['error while creating directory', $],
                        ),

                        // Extract local package into local subdirectory using dynamic filename
                        $cr['tar'].execute(
                            {
                                'args': _ea.list_literal([
                                    `-xzmf`,
                                    `${s_path.Node_Path($p['path to temp directory'])}/${filename}`,
                                    `-C`,
                                    s_path.Node_Path($p['path to output local directory']),
                                    `--strip-components=1`,
                                ]),
                            },
                            ($) => ['error while running tar', $],
                        ),

                        // Download published package using dynamic package name and version
                        $cr['make directory'].execute(
                            t_path_to_path.extend_node_path($p['path to temp directory'], { 'addition': `npm` }),
                            ($) => ['error while creating directory', $],
                        ),

                        $cr['npm'].execute(
                            {
                                'args': _ea.list_literal([
                                    `pack`,
                                    `${package_info.name}@${package_info.version}`,
                                    `--pack-destination`,
                                    `${s_path.Node_Path($p['path to temp directory'])}/npm`,
                                ])
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create published subdirectory
                        $cr['make directory'].execute(
                            $p['path to output published directory'],
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
                                            `${s_path.Node_Path($p['path to temp directory'])}/npm/${package_info.name}-${$v}.tgz`,
                                            `-C`,
                                            `${s_path.Node_Path($p['path to output published directory'])}`,
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