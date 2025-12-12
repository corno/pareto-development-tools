import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'
import * as _et from 'exupery-core-types'

import * as d from "../../interface/commands/set_up_comparison_against_published"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"
import { $ as parse_npm_package } from "../refiners/npm_package/temp"

// export type Variables = {
//     'version': string
// }

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr, $qr) => {
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

        return [
            // Create main output directory
            $cr['make directory'].execute(
                {
                    'path': $p['path to output directory'],
                    'escape spaces in path': true,
                },
                ($) => ['error while creating directory', $],
            ),

            // Create local package using npm pack (if local package path provided)
            $cr['npm'].execute(
                {
                    'args': op_flatten(_ea.list_literal([
                        $p['path to local package'].transform(
                            ($) => _ea.list_literal([
                                `--prefix`,
                                $,
                            ]),
                            () => _ea.list_literal([])
                        ),
                        _ea.list_literal([
                            `pack`,
                            `--pack-destination`,
                            $p['path to output directory'],
                        ])
                    ])),
                },
                ($) => ['error while running npm command', $],
            ),

            // Create local subdirectory
            $cr['make directory'].execute(
                {
                    'path': `${$p['path to output directory']}/local`,
                    'escape spaces in path': true,
                },
                ($) => ['error while creating directory', $],
            ),

            // Extract local package into local subdirectory using dynamic filename
            $cr['tar'].execute(
                {
                    'args': _ea.list_literal([
                        `-xzf`,
                        `${$p['path to output directory']}/${filename}`,
                        `-C`,
                        `${$p['path to output directory']}/local`,
                        `--strip-components=1`,
                    ]),
                },
                ($) => ['error while running tar', $],
            ),

            // Download published package using dynamic package name and version
            $cr['make directory'].execute(
                {
                    'path': `${$p['path to output directory']}/temp_npm`,
                    'escape spaces in path': true,
                },
                ($) => ['error while creating directory', $],
            ),

            $cr['npm'].execute(
                {
                    'args': _ea.list_literal([
                        `pack`,
                        `${package_info.name}@${package_info.version}`,
                        `--pack-destination`,
                        `${$p['path to output directory']}/temp_npm`,
                    ])
                },
                ($) => ['error while running npm command', $],
            ),

            // Create published subdirectory
            $cr['make directory'].execute(
                {
                    'path': `${$p['path to output directory']}/published`,
                    'escape spaces in path': true,
                },
                ($) => ['error while creating directory', $],
            ),

            _easync.p.query_without_error_transformation<d.Error, string>(
                $qr.npm(
                    {
                        'args': _ea.list_literal([
                            `view`,
                            package_info.name,
                            `version`,
                        ]),
                    },
                    ($): d.Error => ['error while running npm query', $]
                ).transform_result(($) => $.stdout),
                // Extract published package into published subdirectory
                ($v) => [
                    $cr['tar'].execute<d.Error>(
                        {
                            'args': _ea.list_literal([
                                `-xzf`,
                                `${$p['path to output directory']}/temp_npm/${package_info.name}-${$v}.tgz`,
                                `-C`,
                                `${$p['path to output directory']}/published`,
                                `--strip-components=1`,
                            ])
                        },
                        ($): d.Error => ['error while running tar', $],
                    )
                ]
            ),
        ]
    }
)