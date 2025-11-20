import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "../../interface/commands/api"

import * as r_instruction from "../refiners/instruction/refiners"


export type Variables = {
    'file content': string
}

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr, $qr) => _ea.cc($p, ($) => {
        switch ($[0]) {
            case 'setup-comparison': return _ea.ss($, ($) => [
                $cr['setup comparison against published'].execute(
                    {
                        'path to local package': _ea.set($['path to package'] + `/pub`),
                        'path to output directory': $['path to package'] + `/temp`,
                    },
                    ($): d.Error => ['setup comparison', $],
                )
            ])
            case 'assert-clean': return _ea.ss($, ($) => [
                $cr['git assert clean'].execute(
                    {
                        'path': _ea.set($['path to package'])
                    },
                    ($): d.Error => ['git assert clean', $],
                )
            ])
            case 'project': return _ea.ss($, ($) => {
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
                        ($x): _et.Command_Promise<d.Project_Package_Error>[] => _ea.cc($.instruction, ($) => {
                            switch ($[0]) {
                                case 'assert clean': return _ea.ss($, ($) => [
                                    $cr['git assert clean'].execute(
                                        {
                                            'path': _ea.set($x['concatenated path'])
                                        },
                                        ($): d.Project_Package_Error => ['git assert clean', $],
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
                                case 'build': return _ea.ss($, ($) => [
                                    $cr['build'].execute(
                                        {
                                            'path': $x['concatenated path']
                                        },
                                        ($): d.Project_Package_Error => ['build', $],
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
                                case 'update dependencies': return _ea.ss($, ($) => [
                                    $cr['update dependencies'].execute(
                                        {
                                            'path': $x['concatenated path']
                                        },
                                        ($): d.Project_Package_Error => ['update dependencies', $],
                                    )
                                ])
                                case 'git commit': return _ea.ss($, ($) => [
                                    $cr['git extended commit'].execute(
                                        {
                                            'path': _ea.set($x['concatenated path']),
                                            'instruction': $
                                        },
                                        ($): d.Project_Package_Error => ['git commit', $],
                                    )
                                ])
                                default: return _ea.au($[0])
                            }
                        }),
                        ($) => ['project', ['packages', $]]
                    )
                ]
            })
            default: return _ea.au($[0])
        }
    })
)
