import * as _p from 'pareto-core/dist/command'
import * as _pa from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'
import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'
import _p_list_build_deprecated from 'pareto-core/dist/_p_list_build_deprecated'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/set_up_comparison_against_published"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/list_of_characters/data"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as q_get_package_json from "../queries/get_package_json"

const remove_n_characters_from_end = ($: string, n: number): d_out.List_of_Characters => {

    const chars = _p_list_from_text($, ($) => $)
    const length = chars.__get_number_of_items()
    const new_length = length - n
    let index = -1

    return _p_list_build_deprecated(($i) => {
        chars.__l_map(($) => {
            index += 1
            if (index < new_length) {
                $i['add item']($)
            }
            return null
        })
    })
}

export const $$: signatures.commands.set_up_comparison_against_published = _p.command_procedure(
    ($d, $s, $q, $c) => {
        const path_x = t_path_to_path.create_node_path($d['path to local package'], { 'node': "package.json" })
        return [
            _p.query(
                q_get_package_json.$$(
                    null,
                    {
                        'read file': $q['read file'],
                    },
                )(
                    {
                        'path to package': $d['path to local package'],
                    },
                    ($): d.Error => ['error while getting package.json', $]
                ),
                ($) => $,
                ($v) => {
                    const package_info = $v
                    const filename = `${$v.name}-${$v.version}.tgz`
                    return [

                        // Create output published directory
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': $d['path to output published directory']
                            },
                            ($) => ['error while creating directory', $],
                        ),
                        // Create output local directory
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': $d['path to output local directory']
                            },
                            ($) => ['error while creating directory', $],
                        ),
                        // Create temp directory
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': $d['path to temp directory']
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        // Create local package using npm pack (if local package path provided)
                        $c['npm'].execute(
                            {
                                'working directory': _p.optional.literal.not_set(),
                                'args': _pa.list.nested_literal_old([
                                    _pa.list.literal([
                                        "pack",
                                        t_path_to_text.Context_Path($d['path to local package']),
                                        "--pack-destination",
                                        t_path_to_text.Node_Path($d['path to temp directory']),
                                    ])
                                ]),
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create local subdirectory
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': $d['path to output local directory']
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        // Extract local package into local subdirectory using dynamic filename
                        $c['tar'].execute(
                            {
                                'working directory': _p.optional.literal.not_set(),
                                'args': _pa.list.literal([
                                    "-xzmf",
                                    `${t_path_to_text.Node_Path($d['path to temp directory'])}/${filename}`,
                                    "-C",
                                    t_path_to_text.Node_Path($d['path to output local directory']),
                                    "--strip-components=1",
                                ]),
                            },
                            ($) => ['error while running tar', $],
                        ),

                        // Download published package using dynamic package name and version
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': t_path_to_path.deprecated_extend_node_path($d['path to temp directory'], { 'addition': "npm" })
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        $c['npm'].execute(
                            {
                                'working directory': _p.optional.literal.not_set(),
                                'args': _pa.list.literal([
                                    "pack",
                                    `${package_info.name}@${package_info.version}`,
                                    "--pack-destination",
                                    `${t_path_to_text.Node_Path($d['path to temp directory'])}/npm`,
                                ])
                            },
                            ($) => ['error while running npm command', $],
                        ),

                        // Create published subdirectory
                        $c['make directory'].execute(
                            {
                                'delete existing': true,
                                'path': $d['path to output published directory']
                            },
                            ($) => ['error while creating directory', $],
                        ),

                        _p.query(
                            $q.npm(
                                {
                                    'working directory': _p.optional.literal.not_set(),
                                    'args': _pa.list.literal([
                                        "view",
                                        package_info.name,
                                        "version",
                                    ]),
                                },
                                ($): d.Error => ['error while running npm query', $]
                            ).transform(($) => remove_n_characters_from_end($.stdout.raw, 1)),
                            // Extract published package into published subdirectory
                            ($) => $,
                            ($v) => [
                                $c['tar'].execute<d.Error>(
                                    {
                                        'working directory': _p.optional.literal.not_set(),
                                        'args': _pa.list.literal([
                                            "-xzmf",
                                            `${t_path_to_text.Node_Path($d['path to temp directory'])}/npm/${package_info.name}-${_p_text_from_list($v, ($) => $)}.tgz`,
                                            "-C",
                                            `${t_path_to_text.Node_Path($d['path to output published directory'])}`,
                                            "--strip-components=1",
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