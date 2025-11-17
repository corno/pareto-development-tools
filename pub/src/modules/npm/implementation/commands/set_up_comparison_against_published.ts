import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d from "../../interface/set_up_comparison_against_published"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"
import { $ as parse_npm_package } from "../../../../implementation/algorithms/refiners/npm_package/temp"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => {
        // Determine package.json path - it will be in the pub subdirectory
        const package_json_path = $p['path to local package'].transform(
            ($) => `${$}/package.json`,
            () => './pub/package.json'  // Default to current directory's pub folder
        );

        // Since we need to execute a complex sequence based on the package.json data,
        // we'll have to use the sequence approach directly with hardcoded values for now
        // TODO: Implement dynamic package.json reading pattern
        const package_info = parse_npm_package(''); // Get hardcoded values from temp function
        const filename = `${package_info.name}-${package_info.version}.tgz`;

        return _easync.p.sequence<d.Error>([
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
                ($) => ['error while running npm command', $],
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

            // Extract local package into local subdirectory using dynamic filename
            $r.commands['tar'].execute.direct(
                ($) => ['error while running tar', $],
                {
                    'args': _ea.array_literal([
                        `-xzf`,
                        `${$p['path to output directory']}/${filename}`,
                        `-C`,
                        `${$p['path to output directory']}/local`,
                        `--strip-components=1`,
                    ]),
                }
            ),

            // Download published package using dynamic package name and version
            $r.commands['make directory'].execute.direct(
                ($) => ['error while creating directory', $],
                {
                    'path': `${$p['path to output directory']}/temp_npm`,
                    'escape spaces in path': true,
                }
            ),

            $r.commands['npm'].execute.direct(
                ($) => ['error while running npm command', $],
                {
                    'args': _ea.array_literal([
                        `pack`,
                        `${package_info.name}@${package_info.version}`,
                        `--pack-destination`,
                        `${$p['path to output directory']}/temp_npm`,
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
            $r.commands['tar'].execute.prepare<d.Error>(
                ($): d.Error => ['error while running tar', $],
                $r.queries.npm(
                    {
                        'args': _ea.array_literal([
                            `view`,
                            package_info.name,
                            `version`,
                        ]),
                    },
                ).transform(
                    ($): d_epe.Parameters => ({
                        'args': _ea.array_literal([
                            `-xzf`,
                            `${$p['path to output directory']}/temp_npm/${package_info.name}-${$}.tgz`,
                            `-C`,
                            `${$p['path to output directory']}/published`,
                            `--strip-components=1`,
                        ])
                    })
                ).transform_error_temp(($): d.Error => ['error while running npm query', $])
            )
        ])
    }
)