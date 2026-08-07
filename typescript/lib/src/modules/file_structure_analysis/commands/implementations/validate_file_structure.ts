import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces from "../interfaces.js"

//schemas
import type * as s_structure from "../../schemas/structure/schema.js"
import type * as s_x from "../../schemas/get_package_files/schema.js"
import type * as s from "../../schemas/file_structure_validation/schema.js"

//dependencies
import * as r_analysis_from_package_files from "../../schemas/package_file_analysis/refiners/package_files.js"
import { $$ as q_get_package_files } from "../../queries/implementations/get_package_files.js"
import * as ser_path from "../../schemas/path/serializers.js"


export const $$: p_.Command_Implementation<
    command_interfaces.validate_file_structure,

    {
        'structure': s_structure.Directory,
        'indentation': string
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_package_files(null, $q)(
                {
                    'path to package': $d['path to package'],
                },
                ($): s_x.Error => $,

            ),
            ($v) => {
                const problems = p_temp.from.list(
                    p_temp.from.dictionary(
                        r_analysis_from_package_files.Package_File_Analysis_Dictionary(
                            $v,
                            {
                                'structure': $s.structure
                            }
                        )
                    ).convert_to_list(
                        ($, id) => ({
                            'path': id,
                            'is a problem': p_temp.from.optional($['unexpected path tail']).decide(
                                ($) => true,
                                () => {
                                    const path = ser_path.Path($.structure.path)

                                    const known_paths: { [key: string]: boolean } = {
                                        "/.gitignore": false,
                                        "/completions": false,
                                        "/data": false,
                                        "/documentation": false,
                                        "/liana/module.liana.lna": false,
                                        "/LICENSE": false,
                                        "/README.md": false,
                                        "/testdata": false,
                                        "/typescript/app/dist": false,
                                        "/typescript/app/package-lock.json": false,
                                        "/typescript/app/package.json": false,
                                        "/typescript/app/src/bin": false,
                                        "/typescript/app/src/bin.ts": false,
                                        "/typescript/app/src/data": false,
                                        "/typescript/app/src/globals.ts": false,
                                        "/typescript/app/src/index.ts": false,
                                        "/typescript/app/tsconfig.json": false,
                                        "/typescript/lib/dist": false,
                                        "/typescript/lib/package-lock.json": false,
                                        "/typescript/lib/package.json": false,
                                        "/typescript/lib/src/commands/implementations": false,
                                        "/typescript/lib/src/commands/interfaces.ts": false,
                                        "/typescript/lib/src/globals.ts": false,
                                        "/typescript/lib/src/index.ts": false,
                                        "/typescript/lib/src/modules/*/commands/implementations": false,
                                        "/typescript/lib/src/modules/*/commands/interfaces.ts": false,
                                        "/typescript/lib/src/modules/*/queries/implementations": false,
                                        "/typescript/lib/src/modules/*/queries/interfaces.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/deserializers.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/refiners": false,
                                        "/typescript/lib/src/modules/*/schemas/*/schema.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/serializers.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/deprecated.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/manual.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/target.ts": false,
                                        "/typescript/lib/src/modules/*/schemas/*/transformers": false,
                                        "/typescript/lib/src/queries/implementations": false,
                                        "/typescript/lib/src/queries/interfaces.ts": false,
                                        "/typescript/lib/src/schemas/*/deserializers.ts": false,
                                        "/typescript/lib/src/schemas/*/refiners": false,
                                        "/typescript/lib/src/schemas/*/schema.ts": false,
                                        "/typescript/lib/src/schemas/*/serializers.ts": false,
                                        "/typescript/lib/src/schemas/*/shorthands/manual.ts": false,
                                        "/typescript/lib/src/schemas/*/shorthands/target.ts": false,
                                        "/typescript/lib/src/schemas/*/transformers": false,
                                        "/typescript/lib/src/temp": false,
                                        "/typescript/lib/tsconfig.json": false,
                                        "/typescript/test/dist": false,
                                        "/typescript/test/package-lock.json": false,
                                        "/typescript/test/package.json": false,
                                        "/typescript/test/src/bin/test.ts": false,
                                        "/typescript/test/src/data": false,
                                        "/typescript/test/src/globals.ts": false,
                                        "/typescript/test/tsconfig.json": false,
                                    }
                                    const looked_up_path = known_paths[path]

                                    if (looked_up_path === undefined) {
                                        return true
                                    }


                                    return looked_up_path
                                }
                            )
                        })
                    )
                ).filter(
                    ($) => $['is a problem']
                )
                return [

                    p_.s.if_<s.Error>(
                        p_temp.from.list(problems).on_has_items(
                            () => true,
                            () => false,
                        ),
                        [

                            p_.s.fail(['file structure problems', p_temp.from.list(
                                problems
                            ).map(
                                ($) => p_s.ph.composed([
                                    p_s.ph.literal($['path']),
                                ])

                            )]),
                        ],
                        [
                            //nothing to do
                        ]
                    )
                ]

            }
        ),

    ]
)
