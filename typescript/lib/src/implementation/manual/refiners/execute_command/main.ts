import * as p_ from 'pareto-core/implementation/refiner'
import type * as p_i from 'pareto-core/interface/refiner'
import p_iterate from 'pareto-core/implementation/refiner/specials/iterate'

import type * as d_out from "../../../../interface/data/execute_command.js"
import type * as d_function from "../../../../interface/data/parse.js"
import type * as d_in from "pareto-application-api/interface/data/main"
import type * as d_publish from "../../../../interface/data/publish.js"

import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

//dependencies
import * as t_context_path_from_text from "pareto-resources/implementation/manual/refiners/path_unrestricted/text"

export namespace interface_ {
    export type Command = p_i.Refiner<
        d_out.Parameters,
        d_function.Error,
        d_in.Parameters
    >
}
import * as temp_interface_ from "../../../../interface/declarations/refiners/execute_command/main.js"

export const Command: interface_.Command = ($, abort) => p_iterate<
    d_out.Parameters,
    string,
    null
>({
    list: $.arguments,
    end_info: null,
    assign: (iterator) => ({
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
                                    "assert-no-open-changes": null,
                                    "build-and-test": null,
                                    "build": null,
                                    "commit-changes": null,
                                    "set-up-comparison": null,
                                    "update-dependencies": null,
                                })] as d_function.Error,
                                (end_info, expected) => abort(expected),
                                ($, expected): d_out.All_Pacakges_Instruction => {
                                    switch ($) {
                                        case "assert-no-open-changes": return ['assert no open changes', null]
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
                                        case "commit-changes": return ['commit changes', {
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
                                    "assert-no-open-changes": null,
                                    "build-and-test": null,
                                    "commit-changes": null,
                                    "update-dependencies": null,
                                })] as d_function.Error,
                                (end_info, expected) => abort(expected),
                                ($, expected) => {
                                    switch ($) {
                                        case "assert-no-open-changes": return ['assert no open changes', null]
                                        case "build-and-test": return ['build and test', null]
                                        case "commit-changes": return ['commit changes', {
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
    }),
    on_dangling_item: () => abort(['too many arguments', null]),
})