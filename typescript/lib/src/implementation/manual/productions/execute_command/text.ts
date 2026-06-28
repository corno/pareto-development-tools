import * as p_ from 'pareto-core/dist/implementation/production'
import * as p_pi from 'pareto-core/dist/interface/production'
import p_unreachable_code_path from 'pareto-core/dist/implementation/transformer/specials/unreachable_code_path'

//data types
import * as d_out from "../../../../interface/data/execute_command"
import * as d_function from "../../../../interface/data/parse"
import * as d_in from "pareto-fountain-pen/dist/interface/generated/liana/schemas/text/data"
import * as d_publish from "../../../../interface/data/publish"

//dependencies
import * as t_context_path_from_text from "pareto-resources/dist/implementation/manual/refiners/path_unrestricted/text"

type signature = p_pi.Production<
    d_out.Parameters,
    d_function.Error,
    d_in.Text,
    null
>


export const Command: signature = (iterator, abort) => ({
    'type': iterator.consume_with_expectation(
        ['expected one of', p_.literal.dictionary({
            "all": null,
            "package": null,
            "project": null,
            "publish": null,
            "set-up-comparison": null,
        })] as d_function.Error,
        (end_info, expected) => abort(expected),
        ($): d_out.Parameters['type'] => {
            {
                switch ($) {
                    case "all": return ['all packages', {
                        'path to project': t_context_path_from_text.Context_Path(
                            iterator.consume(
                                ($) => abort(['expected a text', { 'description': "path to project" }]),
                                ($) => $,
                            )
                        ),
                        'instruction': iterator.consume_with_expectation(
                            ['expected one of', p_.literal.dictionary({
                                "assert-clean": null,
                                "build-and-test": null,
                                "build": null,
                                "git-commit": null,
                                "git-remove-tracked-but-ignored": null,
                                "set-up-comparison": null,
                                "update-dependencies": null,
                            })] as d_function.Error,
                            (end_info, expected) => abort(expected),
                            ($, expected): d_out.All_Pacakges_Instruction => {
                                switch ($) {
                                    case "assert-clean": return ['assert clean', null]
                                    case "build-and-test": return ['build and test', {
                                        'concise': iterator.peek(
                                            () => false,
                                            ($) => $ === "concise"
                                                ? iterator.consume(
                                                    () => p_unreachable_code_path("peeked"),
                                                    () => true,
                                                )
                                                : false,
                                        ),
                                    }]
                                    case "build": return ['build', null]
                                    case "git-commit": return ['version control commit', {
                                        'commit message': iterator.consume(
                                            ($) => abort(['expected a text', { 'description': "commit message" }]),
                                            ($) => $,
                                        ),
                                        'accept broken commits': iterator.peek(
                                            () => false,
                                            ($) => $ === "accept-broken"
                                                ? iterator.consume(
                                                    () => p_unreachable_code_path("peeked"),
                                                    () => true,
                                                )
                                                : false,
                                        ),
                                    }]
                                    case "git-remove-tracked-but-ignored": return ['version control remove tracked but ignored', null]
                                    case "set-up-comparison": return ['set up comparison', null]
                                    case "update-dependencies": return ['update package dependencies', null]
                                    default: return abort(expected)
                                }
                            },

                        )

                    }]
                    case "package": return ['package', {
                        'path': t_context_path_from_text.Context_Path(
                            iterator.consume(
                                ($) => abort(['expected a text', { 'description': "path to package" }]),
                                ($) => $,
                            )
                        ),
                        'instruction': iterator.consume_with_expectation(
                            ['expected one of', p_.literal.dictionary({
                                "assert-clean": null,
                                "build-and-test": null,
                                "git-commit": null,
                                "update-dependencies": null,
                            })] as d_function.Error,
                            (end_info, expected) => abort(expected),
                            ($, expected) => {
                                switch ($) {
                                    case "assert-clean": return ['assert clean', null]
                                    case "build-and-test": return ['build and test', null]
                                    case "git-commit": return ['version control commit', {
                                        'commit message': iterator.consume(
                                            ($) => abort(['expected a text', { 'description': "commit message" }]),
                                            ($) => $,
                                        ),
                                        'accept broken commits': iterator.peek(
                                            () => false,
                                            ($) => $ === "accept-broken"
                                                ? iterator.consume(
                                                    () => p_unreachable_code_path("peeked"),
                                                    () => true,
                                                )
                                                : false,
                                        ),
                                    }]
                                    case "update-dependencies": return ['update package dependencies', null]
                                    default: return abort(expected)
                                }
                            },

                        )

                    }]
                    case "project": return ['project', {
                        'path': t_context_path_from_text.Context_Path(
                            iterator.consume(
                                ($) => abort(['expected a text', { 'description': "path to package" }]),
                                ($) => $,
                            )
                        ),
                        'instruction': iterator.consume_with_expectation(
                            ['expected one of', p_.literal.dictionary({
                                "analyze-file-structure": null,
                                "dependency-graph": null,
                                "list-file-structure-problems": null,
                            })] as d_function.Error,
                            (end_info, expected) => abort(expected),
                            ($, expected) => {
                                switch ($) {
                                    case "analyze-file-structure": return ['analyze file structure', null]
                                    case "dependency-graph": return ['dependency graph', null]
                                    case "list-file-structure-problems": return ['list file structure problems', null]
                                    default: return abort(expected)
                                }
                            },
                        )

                    }]
                    case "publish": return ['publish', {
                        'path to package': t_context_path_from_text.Context_Path(
                            iterator.consume(
                                ($) => abort(['expected a text', { 'description': "path to package" }]),
                                ($) => $,

                            )
                        ),
                        'generation': iterator.consume_with_expectation(
                            ['expected one of', p_.literal.dictionary({
                                "patch": null,
                                "minor": null,
                            })] as d_function.Error,
                            (end_info, expected) => abort(expected),
                            ($, expected) => {
                                switch ($) {
                                    case "patch": return ['patch', null]
                                    case "minor": return ['minor', null]
                                    default: return abort(expected)
                                }
                            },

                        ),
                        'impact': iterator.consume_with_expectation(
                            null,
                            ($) => ['actual publish', {

                                // 'one time password': iterator.xconsume(
                                //     ($) => $,
                                //     (end_info, abort) => abort(['expected a text', { 'description': "one time password" }])
                                // )
                            }],
                            ($, expected): d_publish.Parameters['impact'] => {
                                switch ($) {
                                    case "dry-run": return ['dry run', null]
                                    default: return abort(['expected one of', p_.literal.dictionary({
                                        "dry-run": null,
                                    })])
                                }
                            },



                        ),
                    }]
                    case "set-up-comparison": return ['set up comparison', {
                        'path to package': t_context_path_from_text.Context_Path(
                            iterator.consume(
                                ($) => abort(['expected a text', { 'description': "path to package" }]),
                                ($) => $,

                            )
                        )
                    }]
                    default: return abort(['expected one of', p_.literal.dictionary({
                        'all': null,
                        'package': null,
                        'project': null,
                        'publish': null,
                        'set-up-comparison': null,
                    })])
                }
            }
        },
    )
})