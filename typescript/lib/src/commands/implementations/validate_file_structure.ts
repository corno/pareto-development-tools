import * as p_ from 'pareto-core/implementation/command'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_s from 'pareto-core/implementation/serializer'
import * as p_q from 'pareto-core/implementation/query'
import * as p_r from 'pareto-core/implementation/refiner'
import * as p_schema from 'pareto-core/interface/schema'
import p_sqr from 'pareto-core/implementation/query/super_query_result'
import p_unreachable_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'
import p_log_debug_message from 'pareto-core-dev/log_debug_message'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_stream from "pareto-stream-api/commands/interfaces"
import type * as command_interfaces from "../interfaces.js"
import type * as query_interfaces_typescript from "pareto-typescript/queries/interfaces"

import { $$ as q_get_typescript_files } from "../../queries/implementations/get_typescript_files.js"

//schemas
import type * as s_structure from "../../modules/file_structure_analysis/schemas/structure/schema.js"
import type * as s_x from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/read_nested_directory_content/schema"
import type * as s_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/nested_directory_content_as_read/schema"
import type * as s from "../../schemas/file_structure_validation/schema.js"
import type * as s_ust from "pareto-untyped-syntax-tree-api/schemas/untyped_syntax_tree/schema"
import type * as s_typescript_cst from "pareto-typescript/schemas/concrete_syntax_tree/schema"
import type * as s_get_typescript_files from "../../schemas/get_typescript_files/schema.js"
import type * as s_file_structure_validation from "../../schemas/file_structure_validation/schema.js"


//dependencies
import * as r_analysis_from_package_files from "../../modules/file_structure_analysis/schemas/package_file_analysis/refiners/package_files.js"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/queries/implementations/read_nested_directory_content"
import * as ser_path from "../../modules/file_structure_analysis/schemas/path/serializers.js"
import * as ser_fs_pat from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/serializers"
import * as t_cst_to_location from "pareto-typescript/schemas/concrete_syntax_tree/transformers/location"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/target"



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
        'log': command_interfaces_stream.log_lines
    }
> = p_.command(
    ($d, $s, $q, $c) => [


        p_.s.query(
            p_sqr(
                q_directory_content(null, $q)(
                    {
                        'path': $d['path to package'],
                    },
                    ($): s.Error => ['directory content processing', $],

                )
            ).refine(
                ($, abort) => {

                    // type Package = {
                    //     'typescript': {
                    //         'lib': {
                    //             'src': {
                    //                 'schemas': Schemas
                    //             }
                    //         }
                    //     }
                    // }

                    // type Schemas = p_schema.Dictionary<Schema>

                    // type Schema = {
                    //     'schema': s_directory_content.File
                    // }

                    // const ts_dir = p_r.from.dictionary($).get_entry(
                    //     "typescript",
                    //     {
                    //         'no_such_entry': ($) => abort(['typescript parsing', ['no such node', {
                    //             'path': "/typescript"
                    //         }]])
                    //     }
                    // )
                    // if (ts_dir[0] !== 'directory') {
                    //     return abort(['typescript parsing', ['not a directory', {
                    //         'path': "/typescript"
                    //     }]])
                    // }

                    // const lib_dir = p_r.from.dictionary(ts_dir[1]).get_entry(
                    //     "lib",
                    //     {
                    //         'no_such_entry': ($) => abort(['typescript parsing', ['no such node', {
                    //             'path': "/typescript/lib"
                    //         }]])
                    //     }
                    // )
                    // if (lib_dir[0] !== 'directory') {
                    //     return abort(['typescript parsing', ['not a directory', {
                    //         'path': "/typescript/lib"
                    //     }]])
                    // }
                    // const src_dir = p_r.from.dictionary(lib_dir[1]).get_entry(
                    //     "src",
                    //     {
                    //         'no_such_entry': ($) => abort(['typescript parsing', ['no such node', {
                    //             'path': "/typescript/lib/src"
                    //         }]])
                    //     }
                    // )
                    // if (src_dir[0] !== 'directory') {
                    //     return abort(['typescript parsing', ['not a directory', {
                    //         'path': "/typescript/lib/src"
                    //     }]])
                    // }
                    // const schemas_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                    //     "schemas",
                    // )
                    // const schemas: Schemas = p_r.from.optional(schemas_dir).decide(
                    //     ($): Schemas => {
                    //         if ($[0] !== 'directory') {
                    //             return abort(['typescript parsing', ['not a directory', {
                    //                 'path': "/typescript/lib/src/schemas"
                    //             }]])
                    //         }
                    //         return p_r.from.dictionary($[1]).map(
                    //             ($, id): Schema => {
                    //                 p_log_debug_message(id, () => { })

                    //                 if ($[0] !== 'directory') {
                    //                     return abort(['typescript parsing', ['not a directory', {
                    //                         'path': "/typescript/lib/src/" + id
                    //                     }]])
                    //                 }
                    //                 const schema_file = p_r.from.dictionary($[1]).get_entry(
                    //                     "schema.ts",
                    //                     {
                    //                         'no_such_entry': ($) => abort(['typescript parsing', ['no such node', {
                    //                             'path': "/typescript/lib/src/" + id + "/schema.ts"
                    //                         }]])
                    //                     }
                    //                 )
                    //                 if (schema_file[0] !== 'file') {
                    //                     return abort(['typescript parsing', ['not a file', {
                    //                         'path': "/typescript/lib/src/" + id + "/schema.ts"
                    //                     }]])
                    //                 }
                    //                 return {
                    //                     'schema': schema_file[1]
                    //                 }
                    //             }
                    //         )

                    //     },
                    //     () => {
                    //         return p_.literal.dictionary({})
                    //     }
                    // )

                    // const package_: Package = {
                    //     'typescript': {
                    //         'lib': {
                    //             'src': {
                    //                 'schemas': schemas
                    //             }
                    //         }
                    //     }
                    // }
                    return $
                }
            ),
            ($v) => {


                return [
                    p_.s.query(
                        p_sqr(
                            q_get_typescript_files(null, $q)(
                                $v,
                                ($): s.Error => ['typescript parsing', $],
                            )
                        ).refine(
                            ($, abort) => {

                                type Package = {
                                    'typescript': {
                                        'lib': {
                                            'src': {
                                                'schemas': Schemas
                                            }
                                        }
                                    }
                                }

                                type Schemas = p_schema.Dictionary<Schema>

                                type Schema = {
                                    'schema': s_get_typescript_files.File
                                }


                                const ts_dir = p_r.from.dictionary($).get_entry(
                                    "typescript",
                                    {
                                        'no_such_entry': ($) => abort(['pareto parsing', ['no such node', {
                                            'context path': $d['path to package'],
                                            'internal path': "/",
                                            'name': "typescript",
                                        }]])
                                    }
                                )
                                if (ts_dir[0] !== 'directory') {
                                    return abort(['pareto parsing', ['not a directory', {
                                        'context path': $d['path to package'],
                                        'internal path': "/",
                                        'name': "typescript",
                                    }]])
                                }

                                const lib_dir = p_r.from.dictionary(ts_dir[1]).get_entry(
                                    "lib",
                                    {
                                        'no_such_entry': ($) => abort(['pareto parsing', ['no such node', {
                                            'context path': $d['path to package'],
                                            'internal path': "/typescript",
                                            'name': "lib",
                                        }]])
                                    }
                                )
                                if (lib_dir[0] !== 'directory') {
                                    return abort(['pareto parsing', ['not a directory', {
                                        'context path': $d['path to package'],
                                        'internal path': "/typescript",
                                        'name': "lib",
                                    }]])
                                }
                                const src_dir = p_r.from.dictionary(lib_dir[1]).get_entry(
                                    "src",
                                    {
                                        'no_such_entry': ($) => abort(['pareto parsing', ['no such node', {
                                            'context path': $d['path to package'],
                                            'internal path': "/typescript/lib",
                                            'name': "src",
                                        }]])
                                    }
                                )
                                if (src_dir[0] !== 'directory') {
                                    return abort(['pareto parsing', ['not a directory', {
                                        'context path': $d['path to package'],
                                        'internal path': "/typescript/lib",
                                        'name': "src",
                                    }]])
                                }
                                const globals_file = p_r.from.dictionary(src_dir[1]).get_entry(
                                    "globals.ts",
                                    {
                                        'no_such_entry': ($) => abort(['pareto parsing', ['no such node', {
                                            'context path': $d['path to package'],
                                            'internal path': "/typescript/lib/src",
                                            'name': "globals.ts",
                                        }]])
                                    }
                                )
                                if (globals_file[0] !== 'file') {
                                    return abort(['pareto parsing', ['not a file', {
                                        'context path': $d['path to package'],
                                        'internal path': "/typescript/lib/src",
                                        'name': "globals.ts",
                                    }]])
                                }

                                const index_file = p_r.from.dictionary(src_dir[1]).get_entry(
                                    "index.ts",
                                    {
                                        'no_such_entry': ($) => abort(['pareto parsing', ['no such node', {
                                            'context path': $d['path to package'],
                                            'internal path': "/typescript/lib/src",
                                            'name': "index.ts",
                                        }]])
                                    }
                                )
                                if (index_file[0] !== 'file') {
                                    return abort(['pareto parsing', ['not a file', {
                                        'context path': $d['path to package'],
                                        'internal path': "/typescript/lib/src",
                                        'name': "index.ts",
                                    }]])
                                }

                                const schemas_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                                    "schemas",
                                )
                                const schemas: Schemas = p_r.from.optional(schemas_dir).decide(
                                    ($): Schemas => {
                                        if ($[0] !== 'directory') {
                                            return abort(['pareto parsing', ['not a directory', {
                                                'context path': $d['path to package'],
                                                'internal path': "/typescript/lib/src",
                                                'name': "schemas",
                                            }]])
                                        }
                                        return p_r.from.dictionary($[1]).map_and_aggregate_error<Schema, s_file_structure_validation.Error, s_file_structure_validation.Pareto_Parsing_Error>(
                                            abort,
                                            ($, id, abort): Schema => {

                                                if ($[0] !== 'directory') {
                                                    return abort(['not a directory', {
                                                        'context path': $d['path to package'],
                                                        'internal path': "/typescript/lib/src/schemas",
                                                        'name': id,
                                                    }])
                                                }
                                                const schema_file = p_r.from.dictionary($[1]).get_entry(
                                                    "schema.ts",
                                                    {
                                                        'no_such_entry': ($) => abort(['no such node', {
                                                            'context path': $d['path to package'],
                                                            'internal path': "/typescript/lib/src/schemas/" + id,
                                                            'name': "schema.ts",
                                                        }])
                                                    }
                                                )
                                                if (schema_file[0] !== 'file') {
                                                    return abort(['not a file', {
                                                        'context path': $d['path to package'],
                                                        'internal path': "/typescript/lib/src/schemas/" + id,
                                                        'name': "schema.ts",
                                                    }])
                                                }
                                                p_temp.from.state(schema_file[1]).decide(
                                                    ($): null => {
                                                        switch ($[0]) {
                                                            case 'failure': return p_temp.ss($, ($) => abort(['typescript parsing failed', {
                                                                'location': {
                                                                    'context path': $d['path to package'],
                                                                    'internal path': "/typescript/lib/src/schemas/" + id,
                                                                    'name': "schema.ts"
                                                                }
                                                            }]))
                                                            case 'success': return p_temp.ss($, ($) => {

                                                                const schema: p_r.Refiner<p_schema.List<string>, s_file_structure_validation.Pareto_Parsing_Error, s_typescript_cst.Source_File> = ($, abort) => p_r.from.list($.statements).map_and_aggregate_error<string, s_file_structure_validation.Pareto_Parsing_Error, s_file_structure_validation.Pareto_Parsing_Error>(
                                                                    abort,
                                                                    ($): string => p_temp.from.state($).decide(
                                                                        ($): string => {
                                                                            switch ($[0]) {
                                                                                case 'export declaration': return p_temp.ss($, ($) => "uitwerken")
                                                                                case 'import': return p_temp.ss($, ($) => "uitwerken")
                                                                                case 'module': return p_temp.ss($, ($) => "uitwerken")
                                                                                case 'type alias': return p_temp.ss($, ($) => "uitwerken")
                                                                                default: return abort(['unexpected construct', {
                                                                                    'name': $[0],
                                                                                    'file location': {
                                                                                        'context path': $d['path to package'],
                                                                                        'internal path': "/typescript/lib/src/schemas/" + id,
                                                                                        'name': "schema.ts"
                                                                                    },
                                                                                    'location in file': t_cst_to_location.Statement($)
                                                                                }])
                                                                            }
                                                                        }
                                                                    ),
                                                                    ($): s_file_structure_validation.Pareto_Parsing_Error => ['aggregated', {
                                                                        'errors': $
                                                                    }]
                                                                )
                                                                schema($, abort)
                                                                return null
                                                            })
                                                            default: return p_temp.au($[0])
                                                        }
                                                    }
                                                )
                                                return {
                                                    'schema': schema_file[1]
                                                }
                                            },
                                            ($) => abort(['pareto parsing', ['aggregated', {
                                                'errors': p_temp.from.dictionary($).convert_to_list(($, id) => $)
                                            }]])
                                        )

                                    },
                                    () => {
                                        return p_.literal.dictionary({})
                                    }
                                )


                                const commands_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                                    "commands",
                                )
                                const queries_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                                    "queries",
                                )
                                const modules_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                                    "modules",
                                )
                                const temp_dir = p_r.from.dictionary(src_dir[1]).get_possible_entry(
                                    "temp",
                                )

                                const package_: Package = {
                                    'typescript': {
                                        'lib': {
                                            'src': {
                                                'schemas': schemas
                                            }
                                        }
                                    }
                                }
                                return $
                            }
                        ),
                        ($) => {
                            return [
                                $c.log.execute(
                                    {
                                        'lines': p_.literal.list([
                                            "done parsing typescript files" + ser_fs_pat.Context_Path($d['path to package'])
                                        ])
                                    },
                                    ($) => ['log', $]
                                )
                            ]
                        }
                    ),


                    //FIXME move this to it's own query file in the 'file structure analysis' module
                    p_.s.query(
                        p_q.e.dictionary(
                            r_analysis_from_package_files.Analyzed_Package_Nodes(
                                $v,
                                {
                                    'structure': $s.structure
                                }
                            ),
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

                                                    // if (looked_up_path === true) { //typescript source file
                                                    //     return p_q.e.observe_behavior(
                                                    //         $q['parse typescript file'](
                                                    //             {
                                                    //                 'data': $.content,
                                                    //             },
                                                    //             ($) => $,
                                                    //         ),
                                                    //         {
                                                    //             'success': ($) => {

                                                    //                 const command_implementation: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const query_interface: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const query_implementation: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const command_interface: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const deserializer: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const serializer: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {

                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const refiner: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const transformer: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const shorthands: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 const schema: p_temp.Transformer<s_cst.Source_File, p_schema.List<string>> = ($) => p_temp.from.list($.statements).map_optionally(
                                                    //                     ($) => p_temp.from.state($).decide(
                                                    //                         ($): p_schema.Optional_Value<string> => {
                                                    //                             switch ($[0]) {
                                                    //                                 case 'export declaration': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                 default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                             }
                                                    //                         }
                                                    //                     )
                                                    //                 )
                                                    //                 return p_q.e.direct_result((() => {
                                                    //                     switch (path) {
                                                    //                         case "/typescript/app/src/bin": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )
                                                    //                         case "/typescript/app/src/bin.ts": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )
                                                    //                         case "/typescript/app/src/data": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )
                                                    //                         case "/typescript/lib/src/commands/implementations": return command_implementation($['source file'])
                                                    //                         case "/typescript/lib/src/commands/interfaces.ts": return command_interface($['source file'])


                                                    //                         case "/typescript/lib/src/modules/*/commands/implementations": return command_implementation($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/commands/interfaces.ts": return command_interface($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/queries/implementations": return query_implementation($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/queries/interfaces.ts": return query_interface($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/deserializers.ts": return deserializer($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/refiners": return refiner($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/schema.ts": return schema($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/serializers.ts": return serializer($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/shorthands/deprecated.ts": return shorthands($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/shorthands/manual.ts": return shorthands($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/shorthands/target.ts": return shorthands($['source file'])
                                                    //                         case "/typescript/lib/src/modules/*/schemas/*/transformers": return transformer($['source file'])
                                                    //                         case "/typescript/lib/src/queries/implementations": return query_implementation($['source file'])
                                                    //                         case "/typescript/lib/src/queries/interfaces.ts": return query_interface($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/deserializers.ts": return deserializer($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/refiners": return refiner($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/schema.ts": return schema($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/serializers.ts": return serializer($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/shorthands/manual.ts": return shorthands($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/shorthands/target.ts": return shorthands($['source file'])
                                                    //                         case "/typescript/lib/src/schemas/*/transformers": return transformer($['source file'])
                                                    //                         case "/typescript/lib/src/temp": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         case 'module': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         case 'type alias': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )


                                                    //                         case "/typescript/test/src/bin/test.ts": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'expression': return p_temp.ss($, ($) => p_temp.literal.not_set()) //shebang
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )
                                                    //                         case "/typescript/test/src/data": return p_temp.from.list($['source file'].statements).map_optionally(
                                                    //                             ($) => p_temp.from.state($).decide(
                                                    //                                 ($): p_schema.Optional_Value<string> => {
                                                    //                                     switch ($[0]) {
                                                    //                                         case 'import': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         case 'variable': return p_temp.ss($, ($) => p_temp.literal.not_set())
                                                    //                                         default: return p_temp.literal.set("unexpected statement '" + $[0] + "'")
                                                    //                                     }
                                                    //                                 }
                                                    //                             )
                                                    //                         )
                                                    //                         default: return p_unreachable_path("these are paths that have been tested earlier: " + path)
                                                    //                     }
                                                    //                 })())
                                                    //             },
                                                    //             'error': ($) => p_q.e.direct_result(p_temp.from.state($).decide(
                                                    //                 ($) => {
                                                    //                     switch ($[0]) {
                                                    //                         case 'typed': return p_temp.ss($, ($) => p_temp.literal.list([
                                                    //                             "typescript parse error: " + $.type[0]
                                                    //                         ]))
                                                    //                         case 'untyped': return p_temp.ss($, ($) => p_temp.from.state($).decide(
                                                    //                             ($) => {
                                                    //                                 switch ($[0]) {
                                                    //                                     case 'syntax errors': return p_temp.ss($, ($) => p_temp.from.list($.messages).map(
                                                    //                                         ($) => "typescript parse error: " + $
                                                    //                                     ))
                                                    //                                     default: return p_temp.au($[0])
                                                    //                                 }
                                                    //                             }
                                                    //                         ))
                                                    //                         default: return p_temp.au($[0])
                                                    //                     }
                                                    //                 }
                                                    //             )),
                                                    //         }
                                                    //     )

                                                    // } else {
                                                    //     return p_q.e.direct_result(p_.literal.list<string>([]))
                                                    // }
                                                    return p_q.e.direct_result(p_.literal.list<string>([]))

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
