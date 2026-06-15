import * as pt from 'pareto-core/dist/assign'
import * as p_pi from 'pareto-core/dist/production/interface'
import p_variables from 'pareto-core/dist/specials/variables'
import p_change_context from 'pareto-core/dist/specials/change_context'

//data types
import * as d_out from "../../../../interface/to_be_generated/execute_command"
import * as d_function from "../../../../interface/to_be_generated/parse"
import * as d_in from "pareto-fountain-pen/dist/interface/generated/liana/schemas/text/data"

//dependencies
import * as t_context_path_from_text from "pareto-resources/dist/implementation/manual/refiners/path_unrestricted/text"

type signature = p_pi.Production<d_out.Parameters, d_function.Error, d_in.Text, null>


export const Command: signature = (iterator, abort) => iterator.consume(
    ($): d_out.Parameters => ({
        'type': p_change_context($, ($) => {
            {
                switch ($) {
                    case "all": return ['all packages', {
                        'path to project': t_context_path_from_text.Context_Path(iterator.consume(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )),
                        'instruction': iterator.consume(
                            ($): d_out.All_Pacakges_Instruction => {
                                switch ($) {
                                    case "assert-clean": return ['assert clean', null]
                                    case "build-and-test": return ['build and test', {
                                        'concise': p_variables(() => {
                                            const value = iterator.look_raw()
                                            return value === null
                                                ? false
                                                : value[0] === "concise"
                                                    ? p_variables(() => {
                                                        iterator.discard(() => null)
                                                        return true
                                                    })
                                                    : false
                                        }),
                                    }]
                                    case "build": return ['build', null]
                                    case "git-commit": return ['git commit', {
                                        'commit message': iterator.consume(
                                            ($) => $,
                                            () => abort(['expected a text', { 'description': "commit message" }])
                                        ),
                                        'accept broken commits': p_variables(() => {
                                            const value = iterator.look_raw()
                                            return value === null
                                                ? false
                                                : value[0] === "accept-broken"
                                                    ? p_variables(() => {
                                                        iterator.discard(() => null)
                                                        return true
                                                    })
                                                    : false
                                        }),
                                    }]
                                    case "git-remove-tracked-but-ignored": return ['git remove tracked but ignored', null]
                                    case "set-up-comparison": return ['set up comparison', null]
                                    case "update-dependencies": return ['update package dependencies', null]
                                    default: return abort(['expected one of', pt.literal.dictionary({
                                        'assert-clean': null,
                                        'build-and-test': null,
                                        'build': null,
                                        'git-commit': null,
                                        'git-remove-tracked-but-ignored': null,
                                        'set-up-comparison': null,
                                        'update-dependencies': null,
                                    })])
                                }
                            },
                            () => abort(['expected one of', pt.literal.dictionary({
                                'assert-clean': null,
                                'build-and-test': null,
                                'build': null,
                                'git-commit': null,
                                'git-remove-tracked-but-ignored': null,
                                'set-up-comparison': null,
                                'update-dependencies': null,
                            })])

                        )

                    }]
                    case "package": return ['package', {
                        'path': t_context_path_from_text.Context_Path(iterator.consume(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])
                        )),
                        'instruction': iterator.consume(
                            ($) => {
                                switch ($) {
                                    case "assert-clean": return ['assert clean', null]
                                    case "build-and-test": return ['build and test', null]
                                    case "git-commit": return ['git commit', {
                                        'commit message': iterator.consume(
                                            ($) => $,
                                            () => abort(['expected a text', { 'description': "commit message" }])
                                        ),
                                        'accept broken commits': p_variables(() => {
                                            const value = iterator.look_raw()
                                            return value === null
                                                ? false
                                                : value[0] === "accept-broken"
                                                    ? p_variables(() => {
                                                        iterator.discard(() => null)
                                                        return true
                                                    })
                                                    : false
                                        }),
                                    }]
                                    case "update-dependencies": return ['update package dependencies', null]
                                    default: return abort(['expected one of', pt.literal.dictionary({
                                        'assert-clean': null,
                                        'build-and-test': null,
                                        'git-commit': null,
                                        'update-dependencies': null,
                                    })])
                                }
                            },
                            () => abort(['expected one of', pt.literal.dictionary({
                                'assert-clean': null,
                                'build-and-test': null,
                                'git-commit': null,
                                'update-dependencies': null,
                            })])

                        )

                    }]
                    case "project": return ['project', {
                        'path': t_context_path_from_text.Context_Path(iterator.consume(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])
                        )),
                        'instruction': iterator.consume(
                            ($) => {
                                switch ($) {
                                    case "analyze-file-structure": return ['analyze file structure', null]
                                    case "dependency-graph": return ['dependency graph', null]
                                    case "list-file-structure-problems": return ['list file structure problems', null]
                                    default: return abort(['expected one of', pt.literal.dictionary({
                                        'analyze-file-structure': null,
                                        'dependency-graph': null,
                                        'list-file-structure-problems': null,
                                    })])
                                }
                            },
                            () => abort(['expected one of', pt.literal.dictionary({
                                'analyze-file-structure': null,
                                'dependency-graph': null,
                                'list-file-structure-problems': null,
                            })])

                        )

                    }]
                    case "publish": return ['publish', {
                        'path to package': t_context_path_from_text.Context_Path(iterator.consume(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])

                        )),
                        'generation': iterator.consume(
                            ($) => {
                                switch ($) {
                                    case "patch": return ['patch', null]
                                    case "minor": return ['minor', null]
                                    default: return abort(['expected one of', pt.literal.dictionary({
                                        'patch': null,
                                        'minor': null,
                                    })])
                                }
                            },
                            () => abort(['expected one of', pt.literal.dictionary({
                                'patch': null,
                                'minor': null,
                            })])

                        ),
                        'impact': p_variables(() => {
                            const value = iterator.look_raw()
                            if (value === null) {
                                return ['actual publish', {
                                    // 'one time password': iterator.consume(
                                    //     ($) => $,
                                    //     () => abort(['expected a text', { 'description': "one time password" }])
                                    // )
                                }]
                            } else {
                                switch (value[0]) {
                                    case "--dry-run": {
                                        iterator.discard(() => null)
                                        return ['dry run', null]
                                    }
                                    default:
                                        return abort(['expected a text', { 'description': "'--dry-run'" }])

                                }
                            }
                        }),
                    }]
                    case "set-up-comparison": return ['set up comparison', {
                        'path to package': t_context_path_from_text.Context_Path(iterator.consume(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])

                        ))
                    }]
                    default: return abort(['expected one of', pt.literal.dictionary({
                        'all': null,
                        'package': null,
                        'project': null,
                        'publish': null,
                        'set-up-comparison': null,
                    })])
                }
            }
        })
    }),
    () => abort(['expected one of', pt.literal.dictionary({
        'all': null,
        'package': null,
        'project': null,
        'publish': null,
        'set-up-comparison': null,
    })])
)