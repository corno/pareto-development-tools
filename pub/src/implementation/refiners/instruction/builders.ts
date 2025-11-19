import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/commands/api"
import * as d_error from "../../../interface/commands/bin"

import * as core from "./core"

export const Command = (
    abort: core.Abort<d_error.Parse_Error>,
    iterator: core.Iterator<string, number>,
): d.Command => {
    return iterator['consume current']().transform(
        ($) => {
            switch ($) {
                case 'project':
                    return ['project', {
                        'path to project': iterator['consume current']().transform(
                            ($) => $,
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
                                        return ['git commit', {
                                            'commit message': iterator['consume current']().transform(
                                                ($) => $,
                                                () => abort(['expected a text', { 'description': "commit message" }])
                                            ),
                                            'stage all changes': true,
                                            'push after commit': true,
                                        }]
                                    case 'git-remove-tracked-but-ignored':
                                        return ['git remove tracked but ignored', null]
                                    case 'update-dependencies':
                                        return ['update dependencies', null]
                                    default:
                                        return abort(['expected one of', _ea.dictionary_literal({
                                            'assert clean': null,
                                            'build and test': null,
                                            'build': null,
                                            'git commit': null,
                                            'git remove tracked but ignored': null,
                                            'update dependencies': null,
                                        })])
                                }
                            },
                            () => abort(['expected one of', _ea.dictionary_literal({
                                'assert clean': null,
                                'build and test': null,
                                'build': null,
                                'git commit': null,
                                'git remove tracked but ignored': null,
                                'update dependencies': null,
                            })])
                        )
                    }]
                case 'assert-clean':
                    return ['assert-clean', {
                        'path to package': iterator['consume current']().transform(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])
                        )
                    }]
                case 'setup-comparison':
                    return ['setup-comparison', {
                        'path to package': iterator['consume current']().transform(
                            ($) => $,
                            () => abort(['expected a text', { 'description': "path to package" }])
                        ),
                    }]
                default:
                    return abort(['expected one of', _ea.dictionary_literal({
                        'project': null,
                        'assert-clean': null,
                        'setup-comparison': null,
                    })])
            }
        },
        () => abort(['expected one of', _ea.dictionary_literal({
            'project': null,
            'assert-clean': null,
            'setup-comparison': null,
        })])
    )
}