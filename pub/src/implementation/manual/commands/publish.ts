import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/publish"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import * as q_get_package_json from "../../../modules/npm/implementation/manual/queries/get_package_json"

export const $$: signatures.commands.publish = _p.command_procedure(

    ($p, $cr, $qr) => [

        $cr['git push'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($): d.Error => ['error while running git push', $],
        ),

        $cr['git assert is clean'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git assert is clean at the start', $],
        ),

        $cr['git make pristine'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git make pristine', $],
        ),

        $cr['update package dependencies'].execute(
            {
                'path': $p['path to package'],
            },
            ($) => ['error while running update package dependencies', $],
        ),

        $cr['build and test'].execute(
            {
                'path': $p['path to package'],
            },
            ($) => ['error while running build and test', $],
        ),

        $cr['git assert is clean'].execute(
            {
                'path': _p.optional.set($p['path to package']),
            },
            ($) => ['error while running git assert is clean after updating package dependencies', $],
        ),

        $cr.npm.execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` })),
                'operation': ['version', $p.generation],
            },
            ($) => ['error while running npm version', $],
        ),

        $cr['npm publish'].execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` })),
                'impact': $p.impact,
            },
            ($) => ['error while running npm publish', $],
        ),

        // update the package-lock.json to reflect the new version
        $cr.npm.execute(
            {
                'path': _p.optional.set(t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` })),
                'operation': ['update', {
                    'package-lock only': true
                }],
            },
            ($) => ['error while running npm version', $],
        ),

        _p.query(
            q_get_package_json.$$({
                'read file': $qr['read file'],
            })(
                {
                    'path to package': t_path_to_path.extend_context_path($p['path to package'], { 'addition': `pub` }),
                },
                ($): d.Error => ['error while getting package.json', $]
            ),
            ($) => $,
            ($v) => {
                const package_info = $v
                return [

                    $cr.log.execute(
                        {
                            'lines': _p.list.literal([
                                `Published package ${package_info.name} version ${package_info.version}`
                            ]),
                        },
                        ($): d.Error => ['error while logging', $],
                    ),

                    $cr['git extended commit'].execute(
                        {
                            'path': _p.optional.set($p['path to package']),
                            'instruction': {
                                'commit message': `Published version ${$v.version}`,
                                'stage all changes': true,
                                'push after commit': true,
                            }
                        },
                        ($): d.Error => ['error while running git extended commit', $],
                    ),

                ]
            }
        )
    ]
)
