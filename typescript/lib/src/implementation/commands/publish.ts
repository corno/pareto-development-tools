import * as p_ from 'pareto-core/implementation/command'
import p_variables from 'pareto-core/implementation/command/specials/variables'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as command_interfaces from "../../commands/interfaces.js"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_version_control from "../../submodules/version_control_api/commands/interfaces.js"
import type * as command_interfaces_npm from "../../submodules/npm/commands/interfaces.js"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/commands/interfaces"

//schemas
import * as d from "../../schemas/publish.js"

//dependencies
import * as t_path_to_path from "pareto-resources/schemas/fs_unrestricted_path/transformers/unrestricted_path"
import * as q_get_package_json from "../../submodules/npm/queries/implementations/get_package_json.js"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

export const $$: p_.Command_Implementation<
    command_interfaces.publish,
    {
        'indentation': string
    },
    {
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'version control push': command_interfaces_version_control.push
        'version control extended commit': command_interfaces_version_control.extended_commit
        'version control assert no open changes': command_interfaces_version_control.assert_no_open_changes
        'version control make pristine': command_interfaces_version_control.make_pristine
        'update package dependencies': command_interfaces.update_package_dependencies
        'build and validate': command_interfaces.build_and_validate
        'npm': command_interfaces_npm.npm
        'npm publish': command_interfaces_npm.npm_publish
        'log lines': command_interfaces_pareto_stream_api.log_lines
    }
> = p_.command(

    ($d, $s, $q, $c) => p_variables(
        () => {
            const lib_path = t_path_to_path.extend_context_path_with_list($d['path to package'], { 'addition': p_.literal.list(["typescript", "lib"]) })
            return [

                $c['version control push'].execute(
                    {
                        'path': p_.literal.set($d['path to package']),
                    },
                    ($): d.Error => ['error while running git push', $],
                ),

                // $c['version control assert is clean'].execute(
                //     {
                //         'path': p_.literal.set($d['path to package']),
                //     },
                //     ($) => ['error while running git assert is clean at the start', $],
                // ),

                $c['version control make pristine'].execute(
                    {
                        'path': p_.literal.set($d['path to package']),
                    },
                    ($) => ['error while running git make pristine', $],
                ),

                $c['update package dependencies'].execute(
                    {
                        'path': $d['path to package'],
                    },
                    ($) => ['error while running update package dependencies', $],
                ),

                $c['build and validate'].execute(
                    {
                        'path': $d['path to package'],
                    },
                    ($) => ['error while running build and validate', $],
                ),

                // $c['version control assert is clean'].execute(
                //     {
                //         'path': p_.literal.set($d['path to package']),
                //     },
                //     ($) => ['error while running git assert is clean after updating package dependencies', $],
                // ),

                $c.npm.execute(
                    {
                        'path': p_.literal.set(lib_path),
                        'operation': ['version', $d['parameters 2'].generation],
                    },
                    ($) => ['error while running npm version', $],
                ),

                // update the lib package-lock.json to reflect the new version
                $c.npm.execute(
                    {
                        'path': p_.literal.set(lib_path),
                        'operation': ['update', {
                            'package-lock only': true
                        }],
                    },
                    ($) => ['error while running npm update', $],
                ),

                p_.s.query(
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
                    ($v) => {
                        const package_info = $v
                        return [

                            $c['version control extended commit'].execute(
                                {
                                    'path': p_.literal.set($d['path to package']),
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
                                    'impact': $d['parameters 2'].impact,
                                },
                                ($) => ['error while running npm publish', $],
                            ),

                            $c['log lines'].execute(
                                {
                                    'lines': p_.literal.list([
                                        p_s.ph.composed([

                                            p_s.ph.literal("published:"),
                                            p_s.ph.literal(package_info.name),
                                            p_s.ph.literal("@"),
                                            p_s.ph.literal(package_info.version),
                                        ])
                                    ]),
                                },
                                ($): d.Error => ['error while logging', $],
                            ),

                        ]
                    }
                )
            ]
        })
)
