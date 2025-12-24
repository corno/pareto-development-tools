import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/algorithms/commands/api"
import * as d_error from "../../../interface/algorithms/commands/parse"

import * as r_context_path from "exupery-resources/dist/implementation/refiners/context_path/text"

import * as core from "../../temp_core"

import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

export const Command = (
    abort: core.Abort<d_error.Error>,
    iterator: core.Iterator<string, number>,
): d.Command => {
    return iterator['consume current']().transform(
        ($): d.Command => {
            switch ($) {
                case 'analyze-file-structure':
                    return ['analyze file structure', {
                        'path to project': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'assert-clean':
                    return ['assert clean', {
                        'path to package': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to package" }])
                        )
                    }]
                case 'dependency-graph':
                    return ['dependency graph', {
                        'path to project': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'list-file-structure-problems':
                    return ['list file structure problems', {
                        'path to project': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'project':
                    return ['project', {
                        'path to project': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        ),
                        'instruction': iterator['consume current']().transform(
                            ($): d.Project_Instruction => {
                                switch ($) {
                                    case 'assert-clean':
                                        return ['assert clean', null]
                                    case 'build-and-test':
                                        return ['build and test', null]
                                    case 'build':
                                        return ['build', null]
                                    case 'git-commit':
                                        return ['git extended commit', {
                                            'commit message': iterator['consume current']().transform(
                                                ($) => $,
                                                () => abort(['expected a text', { 'description': "commit message" }])
                                            ),
                                            'stage all changes': true,
                                            'push after commit': true,
                                        }]
                                    case 'git-remove-tracked-but-ignored':
                                        return ['git remove tracked but ignored', null]
                                    case 'set-up-comparison':
                                        return ['set up comparison', null]
                                    case 'update-dependencies':
                                        return ['update dependencies', null]
                                    default:
                                        return abort(['expected one of', _ea.dictionary_literal({
                                            'assert-clean': null,
                                            'build-and-test': null,
                                            'build': null,
                                            'dependency-graph': null,
                                            'git-commit': null,
                                            'git-remove-tracked-but-ignored': null,
                                            'update-dependencies': null,
                                        })])
                                }
                            },
                            () => abort(['expected one of', _ea.dictionary_literal({
                                'assert-clean': null,
                                'build-and-test': null,
                                'build': null,
                                'dependency-graph': null,
                                'git-commit': null,
                                'git-remove-tracked-but-ignored': null,
                                'update-dependencies': null,
                            })])
                        )
                    }]
                case 'set-up-comparison':
                    return ['set up comparison', {
                        'path to package': iterator['consume current']().transform(
                            ($) => r_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to package" }])
                        ),
                    }]
                default:
                    return abort(['expected one of', _ea.dictionary_literal({
                        'analyze-file-structure': null,
                        'assert-clean': null,
                        'dependency-graph': null,
                        'project': null,
                        'set-up-comparison': null,
                    })])
            }
        },
        () => abort(['expected one of', _ea.dictionary_literal({
            'project': null,
            'assert-clean': null,
            'set-up-comparison': null,
            'dependency-graph': null,
            'analyze-file-structure': null,
        })])
    )
}