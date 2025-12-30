import * as _pt from 'pareto-core-refiner'
import * as _pi from 'pareto-core-interface'

import * as d from "../../../../../interface/to_be_generated/api"
import * as d_error from "../../../../../interface/to_be_generated/parse"

import * as ds_context_path from "exupery-resources/dist/implementation/deserializers/schemas/context_path"

import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

const consume_current = <T>(iterator: _pi.Iterator<T>): _pi.Optional_Value<T> => {
    const current = iterator['get current']()
    iterator.consume()
    return current
}

export const Command = (
    iterator: _pi.Iterator<string>,
    abort: _pi.Abort<d_error.Error>,
): d.Parameters => {
    return consume_current(iterator).transform(
        ($): d.Parameters => {
            switch ($) {
                case 'analyze-file-structure':
                    return ['analyze file structure', {
                        'path to project': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'assert-clean':
                    return ['assert clean', {
                        'path to package': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to package" }])
                        )
                    }]
                case 'dependency-graph':
                    return ['dependency graph', {
                        'path to project': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'list-file-structure-problems':
                    return ['list file structure problems', {
                        'path to project': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        )
                    }]
                case 'project':
                    return ['project', {
                        'path to project': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to project" }])
                        ),
                        'instruction': consume_current(iterator).transform(
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
                                            'commit message': consume_current(iterator).transform(
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
                                        return abort(['expected one of', _pt.dictionary_literal({
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
                            () => abort(['expected one of', _pt.dictionary_literal({
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
                        'path to package': consume_current(iterator).transform(
                            ($) => ds_context_path.Context_Path($),
                            () => abort(['expected a text', { 'description': "path to package" }])
                        ),
                    }]
                default:
                    return abort(['expected one of', _pt.dictionary_literal({
                        'analyze-file-structure': null,
                        'assert-clean': null,
                        'dependency-graph': null,
                        'list-file-structure-problems': null,
                        'project': null,
                        'set-up-comparison': null,
                    })])
            }
        },
        () => abort(['expected one of', _pt.dictionary_literal({
            'analyze-file-structure': null,
            'assert-clean': null,
            'dependency-graph': null,
            'list-file-structure-problems': null,
            'project': null,
            'set-up-comparison': null,
        })])
    )
}