import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "../../../interface/temp/procedures/api"

import * as r_instruction from "../refiners/instruction/refiners"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _ea.cc($p, ($) => {
        switch ($[0]) {
            case 'assert-clean': return _ea.ss($, ($) => $r.commands['git assert clean'].execute.direct(
                ($): d.Error => ['git assert clean', $],
                {
                    'path': _ea.set($['path to package'])
                },
            ))
            case 'project': return _ea.ss($, ($) => {
                const path_to_project = $['path to project']
                return _easync.p.dictionary.parallel.query(
                    $r.queries['read directory'](
                        {
                            'path': {
                                'escape spaces in path': true,
                                'path': `${$['path to project']}/packages`,
                            },
                            'prepend results with path': true,
                        },
                    ).transform_error(
                        ($): d.Error => ['project', ['could not read packages directory', $]],
                    ),
                    ($x, key): _et.Command_Promise<d.Project_Package_Error> => _ea.cc($.instruction, ($) => {
                        switch ($[0]) {
                            case 'assert clean': return _ea.ss($, ($) => $r.commands['git assert clean'].execute.direct(
                                ($): d.Project_Package_Error => ['git assert clean', $],
                                {
                                    'path': _ea.set(key)
                                },
                            ))
                            case 'build and test': return _ea.ss($, ($) => $r.commands['build and test'].execute.direct(
                                ($): d.Project_Package_Error => ['build and test', $],
                                {
                                    'path': key
                                },
                            ))
                            case 'build': return _ea.ss($, ($) => $r.commands['build'].execute.direct(
                                ($): d.Project_Package_Error => ['build', $],
                                {
                                    'path': key
                                },
                            ))
                            case 'git remove tracked but ignored': return _ea.ss($, ($) => $r.commands['git remove tracked but ignored'].execute.direct(
                                ($): d.Project_Package_Error => ['git remove tracked but ignored', $],
                                {
                                    'path': _ea.set(key)
                                },
                            ))
                            case 'update dependencies': return _ea.ss($, ($) => $r.commands['update dependencies'].execute.direct(
                                ($): d.Project_Package_Error => ['update dependencies', $],
                                {
                                    'path': key
                                },
                            ))
                            case 'git commit': return _ea.ss($, ($) => $r.commands['git extended commit'].execute.direct(
                                ($): d.Project_Package_Error => ['git commit', $],
                                {
                                    'path': _ea.set(key),
                                    'instruction': $
                                },
                            ))
                            default: return _ea.au($[0])
                        }
                    }),
                    ($) => ['project', ['packages', $]]
                )
            })
            default: return _ea.au($[0])
        }
    })
)
