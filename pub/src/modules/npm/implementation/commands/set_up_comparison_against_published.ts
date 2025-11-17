import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d from "../../interface/set_up_comparison_against_published"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.sequence<d.Error>([
        // Create main output directory
        $r.commands['make directory'].execute.direct(
            ($) => ['error while creating directory', $],
            {
                'path': $p['path to output directory'],
                'escape spaces in path': true,
            }
        ),
        
        // Create local package using npm pack (if local package path provided)
        $r.commands['npm'].execute.direct(
            ($) => ['error while running npm', $],
            {
                'args': op_flatten(_ea.array_literal([
                    $p['path to local package'].transform(
                        ($) => _ea.array_literal([
                            `--prefix`,
                            $,
                        ]),
                        () => _ea.array_literal([])
                    ),
                    _ea.array_literal([
                        `pack`,
                        `--pack-destination`,
                        $p['path to output directory'],
                    ])
                ])),
            }
        ),
        
        // Create local subdirectory
        $r.commands['make directory'].execute.direct(
            ($) => ['error while creating directory', $],
            {
                'path': `${$p['path to output directory']}/local`,
                'escape spaces in path': true,
            }
        ),
        
        // Extract local package into local subdirectory using tar with predicted filename
        $r.commands['tar'].execute.direct(
            ($) => ['error while running tar', $],
            {
                'args': _ea.array_literal([
                    `-xzf`,
                    `${$p['path to output directory']}/astn-0.113.2.tgz`, // hardcoded for testing
                    `-C`,
                    `${$p['path to output directory']}/local`,
                    `--strip-components=1`,
                ]),
            }
        ),
        
        // Download published package using the same package name to a temp location
        $r.commands['make directory'].execute.direct(
            ($) => ['error while creating directory', $],
            {
                'path': `${$p['path to output directory']}/temp`,
                'escape spaces in path': true,
            }
        ),
        
        $r.commands['npm'].execute.direct(
            ($) => ['error while running npm', $],
            {
                'args': _ea.array_literal([
                    `pack`,
                    `astn@0.113.2`, // hardcoded for testing - pack specific version
                    `--pack-destination`,
                    `${$p['path to output directory']}/temp`,
                ])
            }
        ),
        
        // Create published subdirectory
        $r.commands['make directory'].execute.direct(
            ($) => ['error while creating directory', $],
            {
                'path': `${$p['path to output directory']}/published`,
                'escape spaces in path': true,
            }
        ),
        
        // Extract published package into published subdirectory
        $r.commands['tar'].execute.direct(
            ($) => ['error while running tar', $],
            {
                'args': _ea.array_literal([
                    `-xzf`,
                    `${$p['path to output directory']}/temp/astn-0.113.2.tgz`, // from temp directory
                    `-C`,
                    `${$p['path to output directory']}/published`,
                    `--strip-components=1`,
                ]),
            }
        ),
    ])
)