import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'
import * as p_q from 'pareto-core/implementation/query'
import * as p_schema from 'pareto-core/interface/schema'
import p_sqr from 'pareto-core/implementation/query/super_query_result'
import p_unreachable_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces from "../interfaces.js"
import type * as query_interfaces_typescript from "pareto-typescript/queries/interfaces"

//schemas
import type * as s_structure from "../../schemas/structure/schema.js"
import type * as s_x from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s from "../../schemas/file_structure_validation/schema.js"
import type * as s_ust from "pareto-untyped-syntax-tree-api/schemas/untyped_syntax_tree/schema"

//dependencies
import * as r_analysis_from_package_files from "../../schemas/package_file_analysis/refiners/package_files.js"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/queries/implementations/read_nested_directory_content"
import * as ser_path from "../../schemas/path/serializers.js"



export const $$: p_.Command_Implementation<
    command_interfaces.validate_file_structure,

    {
        'structure': s_structure.Directory
        'indentation': string
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
        'parse typescript file': query_interfaces_typescript.parse_file
    },
    {
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_directory_content(null, $q)(
                {
                    'path': $d['path to package'],
                },
                ($): s.Error => ['directory content processing', $],

            ),
            ($v) => {
                const nodes = r_analysis_from_package_files.Analyzed_Package_Nodes(
                    $v,
                    {
                        'structure': $s.structure
                    }
                )
                return [

                    p_.s.query(
                        p_q.e.dictionary(
                            nodes,
                            ($, id) => p_q.decide.state($,
                                ($): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
                                    switch ($[0]) {
                                        case 'unexpected directory': return p_q.ss($, ($) => p_q.e.direct_result(p_.literal.list(["unexpected directory"])))
                                        case 'other': return p_q.ss($, ($) => p_q.e.direct_result(p_.literal.list(["unexpected node, not a dir and not a file"])))
                                        case 'file': return p_q.ss($, ($): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
                                            const xxx = $.content
                                            return p_q.decide.optional($['unexpected path tail'],
                                                ($) => p_q.e.direct_result(p_.literal.list(["unexpected path tail"])),
                                                (): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
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
                                                        "/typescript/app/src/bin": true,
                                                        "/typescript/app/src/bin.ts": true,
                                                        "/typescript/app/src/data": true,
                                                        "/typescript/app/src/globals.ts": false,
                                                        "/typescript/app/src/index.ts": false,
                                                        "/typescript/app/tsconfig.json": false,
                                                        "/typescript/lib/dist": false,
                                                        "/typescript/lib/package-lock.json": false,
                                                        "/typescript/lib/package.json": false,
                                                        "/typescript/lib/src/commands/implementations": true,
                                                        "/typescript/lib/src/commands/interfaces.ts": true,
                                                        "/typescript/lib/src/globals.ts": false,
                                                        "/typescript/lib/src/index.ts": false,
                                                        "/typescript/lib/src/modules/*/commands/implementations": true,
                                                        "/typescript/lib/src/modules/*/commands/interfaces.ts": true,
                                                        "/typescript/lib/src/modules/*/queries/implementations": true,
                                                        "/typescript/lib/src/modules/*/queries/interfaces.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/deserializers.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/refiners": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/schema.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/serializers.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/deprecated.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/manual.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/shorthands/target.ts": true,
                                                        "/typescript/lib/src/modules/*/schemas/*/transformers": true,
                                                        "/typescript/lib/src/queries/implementations": true,
                                                        "/typescript/lib/src/queries/interfaces.ts": true,
                                                        "/typescript/lib/src/schemas/*/deserializers.ts": true,
                                                        "/typescript/lib/src/schemas/*/refiners": true,
                                                        "/typescript/lib/src/schemas/*/schema.ts": true,
                                                        "/typescript/lib/src/schemas/*/serializers.ts": true,
                                                        "/typescript/lib/src/schemas/*/shorthands/manual.ts": true,
                                                        "/typescript/lib/src/schemas/*/shorthands/target.ts": true,
                                                        "/typescript/lib/src/schemas/*/transformers": true,
                                                        "/typescript/lib/src/temp": true,
                                                        "/typescript/lib/tsconfig.json": false,
                                                        "/typescript/test/dist": false,
                                                        "/typescript/test/package-lock.json": false,
                                                        "/typescript/test/package.json": false,
                                                        "/typescript/test/src/bin/test.ts": true,
                                                        "/typescript/test/src/data": true,
                                                        "/typescript/test/src/globals.ts": false,
                                                        "/typescript/test/tsconfig.json": false,
                                                    }
                                                    const looked_up_path = known_paths[path]

                                                    if (looked_up_path === undefined) {
                                                        return p_q.e.direct_result(p_.literal.list(["unknown path: " + path]))
                                                    }

                                                    if (looked_up_path === true) { //typescript source file
                                                        return p_q.e.observe_behavior(
                                                            $q['parse typescript file'](
                                                                {
                                                                    'data': $.content,
                                                                },
                                                                ($) => $,
                                                            ),
                                                            {
                                                                'success': ($) => {

                                                                    const command_implementation = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const query_interface = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const query_implementation = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const command_interface = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const deserializer = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const serializer = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const refiner = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const transformer = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    // case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const shorthands = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    const schema = () => p_temp.from.list($['source file'].statements).map_optionally(
                                                                        ($) => p_temp.from.state($).decide(
                                                                            ($): p_schema.Optional_Value<string> => {
                                                                                switch ($[0]) {
                                                                                    case 'export declaration': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                    default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                }
                                                                            }
                                                                        )
                                                                    )
                                                                    return p_q.e.direct_result((() => {
                                                                        switch (path) {
                                                                            case "/typescript/app/src/bin": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )
                                                                            case "/typescript/app/src/bin.ts": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )
                                                                            case "/typescript/app/src/data": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )
                                                                            case "/typescript/lib/src/commands/implementations": return command_implementation()
                                                                            case "/typescript/lib/src/commands/interfaces.ts": return command_interface()


                                                                            case "/typescript/lib/src/modules/*/commands/implementations": return command_implementation()
                                                                            case "/typescript/lib/src/modules/*/commands/interfaces.ts": return command_interface()
                                                                            case "/typescript/lib/src/modules/*/queries/implementations": return query_implementation()
                                                                            case "/typescript/lib/src/modules/*/queries/interfaces.ts": return query_interface()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/deserializers.ts": return deserializer()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/refiners": return refiner()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/schema.ts": return schema()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/serializers.ts": return serializer()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/shorthands/deprecated.ts": return shorthands()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/shorthands/manual.ts": return shorthands()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/shorthands/target.ts": return shorthands()
                                                                            case "/typescript/lib/src/modules/*/schemas/*/transformers": return transformer()
                                                                            case "/typescript/lib/src/queries/implementations": return query_implementation()
                                                                            case "/typescript/lib/src/queries/interfaces.ts": return query_interface()
                                                                            case "/typescript/lib/src/schemas/*/deserializers.ts": return deserializer()
                                                                            case "/typescript/lib/src/schemas/*/refiners": return refiner()
                                                                            case "/typescript/lib/src/schemas/*/schema.ts": return schema()
                                                                            case "/typescript/lib/src/schemas/*/serializers.ts": return serializer()
                                                                            case "/typescript/lib/src/schemas/*/shorthands/manual.ts": return shorthands()
                                                                            case "/typescript/lib/src/schemas/*/shorthands/target.ts": return shorthands()
                                                                            case "/typescript/lib/src/schemas/*/transformers": return transformer()
                                                                            case "/typescript/lib/src/temp": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            // case 'export declaration': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )


                                                                            case "/typescript/test/src/bin/test.ts": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )
                                                                            case "/typescript/test/src/data": return p_temp.from.list($['source file'].statements).map_optionally(
                                                                                ($) => p_temp.from.state($).decide(
                                                                                    ($): p_schema.Optional_Value<string> => {
                                                                                        switch ($[0]) {
                                                                                            case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                                                            default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                                                        }
                                                                                    }
                                                                                )
                                                                            )
                                                                            default: return p_unreachable_path("these are paths that have been tested earlier: " + path)
                                                                        }
                                                                    })())
                                                                    //     .refine(
                                                                    //     ($, abort) => {
                                                                    //         r_cst_from_ust.Source_File(
                                                                    //             $['untyped syntax tree'].root,
                                                                    //             ($) => abort(null)
                                                                    //         )
                                                                    //         const xxxx = ($: s_ust.Node): p_schema.List<string> => {
                                                                    //             return p_temp.from.list($.children).map(
                                                                    //                 ($) => p_.from.state($).decide(
                                                                    //                     ($) => {
                                                                    //                         switch ($[0]) {

                                                                    //                             default: return p_.au($[0])
                                                                    //                         }
                                                                    //                     }
                                                                    //                 )
                                                                    //             )
                                                                    //         }
                                                                    //         return xxxx($['untyped syntax tree'].root)
                                                                    //     }
                                                                    // )
                                                                    // return p_q.e.direct_result(p_.literal.list<string>([]))
                                                                },
                                                                'error': ($) => p_q.e.direct_result(p_temp.from.state($).decide(
                                                                    ($) => {
                                                                        switch ($[0]) {
                                                                            case 'typed': return p_temp.ss($, ($) => p_temp.literal.list([
                                                                                "typescript parse error: " + $.type[0]
                                                                            ]))
                                                                            case 'untyped': return p_temp.ss($, ($) => p_temp.from.state($).decide(
                                                                                ($) => {
                                                                                    switch ($[0]) {
                                                                                        case 'syntax errors': return p_temp.ss($, ($) => p_temp.from.list($.messages).map(
                                                                                            ($) => "typescript parse error: " + $
                                                                                        ))
                                                                                        default: return p_temp.au($[0])
                                                                                    }
                                                                                }
                                                                            ))
                                                                            default: return p_temp.au($[0])
                                                                        }
                                                                    }
                                                                )),
                                                            }
                                                        )

                                                    } else {
                                                        return p_q.e.direct_result(p_.literal.list<string>([]))
                                                    }
                                                }
                                            )
                                        })
                                        default: return p_q.au($[0])
                                    }
                                }
                            ),
                            ($): s.Error => ['node analysis', $]
                        ),
                        ($) => {
                            const problem_nodes = p_temp.from.dictionary(
                                $,
                            ).filter(
                                ($) => p_temp.from.list($).on_has_items(
                                    ($) => true,
                                    () => false,
                                )
                            )
                            return [
                                p_.s.if_<s.Error>(
                                    p_temp.from.dictionary(
                                        problem_nodes
                                    ).on_has_entries(
                                        () => true,
                                        () => false,
                                    ),
                                    [

                                        p_.s.fail(['file structure problems', p_temp.from.dictionary(
                                            problem_nodes
                                        ).map(
                                            ($, id) => $

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

            }
        ),

    ]
)
