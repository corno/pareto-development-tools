import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "../../interface/commands/api"

// import * as r_instruction from "../refiners/instruction/refiners"


// export type Variables = {
//     'file content': string
// }

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
                                    'path': `${$['path to project']}/packages`,
                                },
                            },
                            ($): d.Error => ['project', ['could not read packages directory', $]],
                        ),
                        ($x, key): _et.Command_Promise<d.Project_Package_Error>[] => _ea.cc($.instruction, ($) => {
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
                                            'path to local package': $x['concatenated path'] + `/pub`,
                                            'path to output local directory': path_to_project + `/temp/local/` + key,
                                            'path to output published directory': path_to_project + `/temp/published/` + key,
                                            'path to temp directory': path_to_project + `/temp/temp/` + key,
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
                        'path to local package': $['path to package'] + `/pub`,
                        'path to output local directory': $['path to package'] + `/temp/local`,
                        'path to output published directory': $['path to package'] + `/temp/published`,
                        'path to temp directory': $['path to package'] + `/temp/temp`,
                    },
                    ($): d.Error => ['set up comparison', $],
                )
            ])
            default: return _ea.au($[0])
        }
    })
)
