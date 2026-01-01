import * as _pc from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pds from 'pareto-core-deserializer'
import * as _pinternals from 'pareto-core-internals'
import * as _pq from 'pareto-core-query'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/set_up_comparison_against_published"
import * as d_npm_package from "../schemas/npm_package/refiners/temp"

//dependencies
import { $$ as r_parse_npm_package } from "../schemas/npm_package/refiners/temp"
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
// import * as ds_context_path from "pareto-resources/dist/implementation/manual/schemas/context_path/deserializers"

const remove_n_characters_from_end = ($: string, n: number): string => {

    const chars = _pds.text_to_character_list($)
    const length = chars.get_number_of_elements()
    const new_length = length - n
    let index = -1

    return _pds.build_text(($i) => {
        chars.__for_each(($) => {
            index += 1
            if (index < new_length) {
                $i['add character']($)
            }
        })
    })
}

export const $$: signatures.commands.set_up_comparison_against_published = _pc.create_command_procedure(
    ($p, $cr, $qr) => {

        return [
            _pc.query_without_error_transformation<d.Error, d_npm_package.NPM_Package>(
                $qr['read file'](
                    t_path_to_path.create_node_path($p['path to local package'], `package.json`),
                    ($): d.Error => ['error while reading package.json', $],
                ).refine_without_error_transformation(
                    ($, abort) => r_parse_npm_package(
                        $,
                        ($) => abort(['error while parsing package.json', $]),
                    ),

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
                                'args': _pt.list_literal([
                                    _pt.list_literal([
                                        `pack`,
                                        s_path.Context_Path($p['path to local package']),
                                        `--pack-destination`,
                                        s_path.Node_Path($p['path to temp directory']),
                                    ])
                                ]).flatten(($) => $),
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
                                'args': _pt.list_literal([
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
                                'args': _pt.list_literal([
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

                        _pc.query_without_error_transformation<d.Error, string>(
                            $qr.npm(
                                {
                                    'args': _pt.list_literal([
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
                                        'args': _pt.list_literal([
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