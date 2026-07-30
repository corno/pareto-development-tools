import * as p_ from 'pareto-core/implementation/refiner'
import p_iterate from 'pareto-core/implementation/refiner/specials/iterate'
import p_unreachable_code_path from 'pareto-core/implementation/transformer/specials/unreachable_code_path'

import type * as s_in from "../../../interface/schemas/main.js"
//schemas
import type * as s_out from "../../../interface/schemas/command_instruction.js"
import type * as s_error from "../../../interface/schemas/parse.js"
import type * as s_publish from "../../../interface/schemas/publish.js"

//dependencies
import * as deser_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/implementation/deserializers/path"

export const Command: p_.Refiner<
    s_out.Parameters,
    s_error.Error,
    s_in.Parameters
>
    = ($, abort) => p_iterate<
        s_out.Parameters,
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
                    "set-up-comparison": null,
                })] as s_error.Error,
                (end_info, expected) => abort(expected),
                ($): s_out.Parameters['type'] => {
                    {
                        switch ($) {
                            case "all": return ['all packages', {
                                'path to project': deser_path.Context_Path(
                                    iterator.consume(
                                        ($) => abort(['expected a text', { 'description': "path to project" }]),
                                        ($) => $,
                                    )
                                ),
                                'instruction': iterator.consume_with_expectation(
                                    ['expected one of', p_.literal.dictionary({
                                        "analyze-file-structure": null,
                                        "assert-no-open-changes": null,
                                        "build-and-validate": null,
                                        "build": null,
                                        "commit-changes": null,
                                        "list-file-structure-problems": null,
                                        "set-up-comparison": null,
                                        "update-dependencies": null,
                                    })] as s_error.Error,
                                    (end_info, expected) => abort(expected),
                                    ($, expected): s_out.All_Pacakges_Instruction => {
                                        switch ($) {
                                            case "analyze-file-structure": return ['analyze file structure', null]
                                            case "assert-no-open-changes": return ['assert no open changes', null]
                                            case "build-and-validate": return ['build and validate', {
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
                                            case "list-file-structure-problems": return ['list file structure problems', null]
                                            case "set-up-comparison": return ['set up comparison', null]
                                            case "update-dependencies": return ['update package dependencies', null]
                                            default: return abort(expected)
                                        }
                                    },

                                )

                            }]
                            case "package": return ['package', {
                                'path': deser_path.Context_Path(
                                    iterator.consume(
                                        ($) => abort(['expected a text', { 'description': "path to package" }]),
                                        ($) => $,
                                    )
                                ),
                                'instruction': iterator.consume_with_expectation(
                                    ['expected one of', p_.literal.dictionary({
                                        "assert-no-open-changes": null,
                                        "build-and-validate": null,
                                        "commit-changes": null,
                                        "list-file-structure-problems": null,
                                        "publish": null,
                                        "update-dependencies": null,
                                    })] as s_error.Error,
                                    (end_info, expected) => abort(expected),
                                    ($, expected) => {
                                        switch ($) {
                                            case "assert-no-open-changes": return ['assert no open changes', null]
                                            case "build-and-validate": return ['build and validate', null]
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
                                            case "list-file-structure-problems": return ['list file structure problems', null]
                                            case "publish": return ['publish', {
                                                'path to package': deser_path.Context_Path(
                                                    iterator.consume(
                                                        ($) => abort(['expected a text', { 'description': "path to package" }]),
                                                        ($) => $,

                                                    )
                                                ),
                                                'generation': iterator.consume_with_expectation(
                                                    ['expected one of', p_.literal.dictionary({
                                                        "patch": null,
                                                        "minor": null,
                                                    })] as s_error.Error,
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
                                                    ($, expected): s_publish.Parameters2['impact'] => {
                                                        switch ($) {
                                                            case "dry-run": return ['dry run', null]
                                                            default: return abort(['expected one of', p_.literal.dictionary({
                                                                "dry-run": null,
                                                            })])
                                                        }
                                                    },



                                                ),
                                            }]
                                            case "update-dependencies": return ['update package dependencies', null]
                                            default: return abort(expected)
                                        }
                                    },

                                )

                            }]
                            case "project": return ['project', {
                                'path': deser_path.Context_Path(
                                    iterator.consume(
                                        ($) => abort(['expected a text', { 'description': "path to package" }]),
                                        ($) => $,
                                    )
                                ),
                                'instruction': iterator.consume_with_expectation(
                                    ['expected one of', p_.literal.dictionary({
                                        "dependency-graph": null,
                                    })] as s_error.Error,
                                    (end_info, expected) => abort(expected),
                                    ($, expected) => {
                                        switch ($) {
                                            case "dependency-graph": return ['dependency graph', null]
                                            default: return abort(expected)
                                        }
                                    },
                                )

                            }]
                            case "set-up-comparison": return ['set up comparison', {
                                'path to package': deser_path.Context_Path(
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