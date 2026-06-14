import * as pt from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import p_variables from 'pareto-core/dist/_p_variables'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/publish"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as q_get_package_json from "../../../modules/npm/implementation/manual/queries/get_package_json"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const $$: signatures.procedures.publish = pt.command_procedure(

    ($d, $s, $q, $c) => p_variables(() => {
        const lib_path = t_path_to_path.extend_context_path_with_list($d['path to package'], { 'addition': pt.list.literal(["typescript", "lib"]) })
        return [

            $c['git push'].execute(
                {
                    'path': pt.optional.literal.set($d['path to package']),
                },
                ($): d.Error => ['error while running git push', $],
            ),

            // $c['git assert is clean'].execute(
            //     {
            //         'path': pt.optional.literal.set($d['path to package']),
            //     },
            //     ($) => ['error while running git assert is clean at the start', $],
            // ),

            $c['git make pristine'].execute(
                {
                    'path': pt.optional.literal.set($d['path to package']),
                },
                ($) => ['error while running git make pristine', $],
            ),

            $c['update package dependencies'].execute(
                {
                    'path': $d['path to package'],
                },
                ($) => ['error while running update package dependencies', $],
            ),

            $c['build and test'].execute(
                {
                    'path': $d['path to package'],
                },
                ($) => ['error while running build and test', $],
            ),

            // $c['git assert is clean'].execute(
            //     {
            //         'path': pt.optional.literal.set($d['path to package']),
            //     },
            //     ($) => ['error while running git assert is clean after updating package dependencies', $],
            // ),

            $c.npm.execute(
                {
                    'path': pt.optional.literal.set(lib_path),
                    'operation': ['version', $d.generation],
                },
                ($) => ['error while running npm version', $],
            ),

            // update the lib package-lock.json to reflect the new version
            $c.npm.execute(
                {
                    'path': pt.optional.literal.set(lib_path),
                    'operation': ['update', {
                        'package-lock only': true
                    }],
                },
                ($) => ['error while running npm update', $],
            ),

            pt.query(
                q_get_package_json.$$(
                    null,
                    {
                        'read file': $q['read file'],
                    },
                )(
                    {
                        'path to package': lib_path,
                    },
                    ($): d.Error => ['error while getting package.json', $]
                ),
                ($) => $,
                ($v) => {
                    const package_info = $v
                    return [

                        $c['git extended commit'].execute(
                            {
                                'path': pt.optional.literal.set($d['path to package']),
                                'instruction': {
                                    'commit message': "pdt: published version " + $v.version,
                                    'stage all changes': true,
                                    'push after commit': true,
                                }
                            },
                            ($): d.Error => ['error while running git extended commit', $],
                        ),

                        $c['npm publish'].execute(
                            {
                                'path': lib_path,
                                'impact': $d.impact,
                            },
                            ($) => ['error while running npm publish', $],
                        ),

                        $c.log.execute(
                            {
                                'message': sh.pg.sentences([
                                    sh.sentence([
                                        sh.ph.literal("published:"),
                                        sh.ph.literal(package_info.name),
                                        sh.ph.literal("@"),
                                        sh.ph.literal(package_info.version),
                                    ])
                                ])
                            },
                            ($): d.Error => ['error while logging', $],
                        ),

                    ]
                }
            )
        ]
    })
)
