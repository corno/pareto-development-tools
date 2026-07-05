import * as p_ from 'pareto-core/implementation/command'
import * as p_t from 'pareto-core/implementation/transformer'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/implementation/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import * as interface_ from "../../../interface/commands.js"

//data types
import * as d from "../../../interface/data/set_up_comparison_against_published.js"
import * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/list_of_characters/data"

//dependencies
import * as t_path_to_text from "pareto-resources/implementation/manual/transformers/unrestricted_path/text"
import * as t_path_to_path from "pareto-resources/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as q_get_package_json from "../queries/get_package_json.js"

const remove_n_characters_from_end = ($: string, n: number): d_out.List_of_Characters => {

    const chars = p_list_from_text(
        $,
        ($) => $
    )
    const length = p_t.from.list(chars).amount_of_items()
    const new_length = length - n
    let index = -1

    return p_list_build_deprecated(
        ($i) => {
            p_t.from.list(chars).map(
                ($) => {
                    index += 1
                    if (index < new_length) {
                        $i['add item']($)
                    }
                    return null
                })
        })
}

export const $$: interface_.procedures.set_up_comparison_against_published = p_.command_procedure(
    ($d, $s, $q, $c) => {
        // const path_x = t_path_to_path.create_node_path($d['path to local package'], { 'node': "package.json" })
        return [
            p_.s.query(
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
                                'working directory': p_.literal.not_set(),
                                'args': p_.literal.list([
                                    "pack",
                                    t_path_to_text.Context_Path($d['path to local package']),
                                    "--pack-destination",
                                    t_path_to_text.Node_Path($d['path to temp directory']),
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
                                'working directory': p_.literal.not_set(),
                                'args': p_.literal.list([
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
                                'working directory': p_.literal.not_set(),
                                'args': p_.literal.list([
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

                        p_.s.query(
                            p_super_query_result($q.npm(
                                {
                                    'working directory': p_.literal.not_set(),
                                    'args': p_.literal.list([
                                        "view",
                                        package_info.name,
                                        "version",
                                    ]),
                                },
                                ($): d.Error => ['error while running npm query', $]
                            )).transform(
                                ($) => remove_n_characters_from_end($.stdout.raw, 1)
                            ),
                            // Extract published package into published subdirectory
                            ($v) => [
                                $c['tar'].execute<d.Error>(
                                    {
                                        'working directory': p_.literal.not_set(),
                                        'args': p_.literal.list([
                                            "-xzmf",
                                            `${t_path_to_text.Node_Path($d['path to temp directory'])}/npm/${package_info.name}-${p_text_from_list(
                                                $v,
                                                ($) => $
                                            )}.tgz`,
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