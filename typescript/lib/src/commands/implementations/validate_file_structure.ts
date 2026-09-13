import * as p_ from 'pareto-core/command'
import * as p_temp from 'pareto-core/transformer'
import * as p_q from 'pareto-core/query'
import * as p_r from 'pareto-core/refiner'
import * as p_schema from 'pareto-core/schema'
import p_super_query_result from 'pareto-core/__internal/query/super_query_result'

//interface dependencies
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/queries/interfaces"
import type * as command_interfaces_stream from "pareto-stream-api/commands/interfaces"
import type * as command_interfaces from "../interfaces.js"
import type * as query_interfaces_typescript from "pareto-typescript/queries/interfaces"

import { $$ as q_get_typescript_files } from "../../modules/pareto_language/queries/implementations/get_typescript_files.js"

//schemas
import type * as s_structure from "../../modules/file_structure_analysis/schemas/structure/schema.js"
import type * as s from "../../schemas/file_structure_validation/schema.js"


//dependencies
import * as r_analysis_from_package_files from "../../modules/file_structure_analysis/schemas/package_file_analysis/refiners/package_files.js"
import { $$ as q_directory_content } from "pareto-filesystem-unrestricted-api/modules/helpers/queries/implementations/read_nested_directory_content"
import * as ser_path from "../../modules/file_structure_analysis/schemas/path/serializers.js"
import * as ser_fs_pat from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/serializers"
import * as r_pareto_package_from_typescript_directory from "../../modules/pareto_language/schemas/package/refiners/typescript_directory.js"

//shorthands


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
            p_super_query_result(
                q_directory_content(null, $q)(
                    {
                        'path': $d['path to package'],
                    },
                    ($): s.Error => ['directory content processing', $],

                )
            ).refine(
                ($, abort) => {
                    return $
                }
            ),
            ($v) => {


                return [
                    p_.s.query(
                        p_super_query_result(
                            q_get_typescript_files(null, $q)(
                                $v,
                                ($): s.Error => ['typescript parsing', $],
                            )
                        ).refine(
                            ($, abort) => {
                                r_pareto_package_from_typescript_directory.Package(
                                    $,
                                    ($) => abort(['pareto parsing', {
                                        'error': $,
                                        'context path': $d['path to package']
                                    }])
                                )

                                return $
                            }
                        ),
                        ($) => {
                            return [
                                $c.log.execute(
                                    {
                                        'lines': p_.literal.list([
                                            "done parsing typescript files: " + ser_fs_pat.Context_Path($d['path to package'])
                                        ])
                                    },
                                    ($) => ['log', $]
                                )
                            ]
                        }
                    ),


                    //FIXME move this to it's own query file in the 'file structure analysis' module
                    p_.s.query(
                        p_q.e_deprecated.deprecated_dictionary(
                            r_analysis_from_package_files.Analyzed_Package_Nodes(
                                $v,
                                {
                                    'structure': $s.structure
                                }
                            ),
                            ($, id) => p_q.decide.state($,
                                ($): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
                                    switch ($[0]) {
                                        case 'unexpected directory': return p_q.option($, ($) => p_q.e_deprecated.deprecated_direct_result(p_.literal.list(["unexpected directory"])))
                                        case 'other': return p_q.option($, ($) => p_q.e_deprecated.deprecated_direct_result(p_.literal.list(["unexpected node, not a dir and not a file"])))
                                        case 'file': return p_q.option($, ($): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
                                            return p_q.decide.optional($['unexpected path tail'],
                                                ($) => p_q.e_deprecated.deprecated_direct_result(p_.literal.list(["unexpected path tail"])),
                                                (): p_q.Query_Result<p_schema.List<string>, s.Node_Error> => {
                                                    return p_q.e_deprecated.deprecated_direct_result(p_.literal.list<string>([]))


                                                }
                                            )
                                        })
                                        default: return p_q.exhaustive($[0])
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
