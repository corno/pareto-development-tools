import * as _p from 'pareto-core/dist/refiner'
import * as _pi from 'pareto-core/dist/interface'
import { _p_deprecated_block } from 'pareto-core/dist/deprecated_block'

import * as d from "../../../../../interface/to_be_generated/execute_command"
import * as d_error from "../../../../../interface/to_be_generated/parse"

import * as ds_context_path from "pareto-resources/dist/implementation/manual/schemas/context_path/deserializers"

type signature = _pi.Production<d.Parameters, d_error.Error, string>

export const Command: signature = (iterator, abort) => iterator.consume(
    ($): d.Parameters => {
        switch ($) {
            case 'all': return ['all packages', {
                'path to project': ds_context_path.Context_Path(iterator.consume(
                    ($) => $,
                    () => abort(['expected a text', { 'description': "path to project" }])
                )),
                'instruction': iterator.consume(
                    ($): d.All_Pacakges_Instruction => {
                        switch ($) {
                            case 'assert-clean': return ['assert clean', null]
                            case 'build-and-test': return ['build and test', {
                                'concise': _p_deprecated_block(() => {
                                    const value = iterator.look()
                                    return value === null
                                        ? false
                                        : value[0] === "concise"
                                            ? _p_deprecated_block(() => {
                                                iterator.discard(() => null)
                                                return true
                                            })
                                            : false
                                }),
                            }]
                            case 'build': return ['build', null]
                            case 'git-commit': return ['git commit', {
                                'commit message': iterator.consume(
                                    ($) => $,
                                    () => abort(['expected a text', { 'description': "commit message" }])
                                ),
                                'accept broken commits': _p_deprecated_block(() => {
                                    const value = iterator.look()
                                    return value === null
                                        ? false
                                        : value[0] === "accept-broken"
                                            ? _p_deprecated_block(() => {
                                                iterator.discard(() => null)
                                                return true
                                            })
                                            : false
                                }),
                            }]
                            case 'git-remove-tracked-but-ignored': return ['git remove tracked but ignored', null]
                            case 'set-up-comparison': return ['set up comparison', null]
                            case 'update-dependencies': return ['update package dependencies', null]
                            default: return abort(['expected one of', _p.dictionary.literal({
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
                    () => abort(['expected one of', _p.dictionary.literal({
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
            case 'package': return ['package', {
                'path': ds_context_path.Context_Path(iterator.consume(
                    ($) => $,
                    () => abort(['expected a text', { 'description': "path to package" }])
                )),
                'instruction': iterator.consume(
                    ($) => {
                        switch ($) {
                            case 'assert-clean': return ['assert clean', null]
                            case 'build-and-test': return ['build and test', null]
                            case 'git-commit': return ['git commit', {
                                'commit message': iterator.consume(
                                    ($) => $,
                                    () => abort(['expected a text', { 'description': "commit message" }])
                                ),
                                'accept broken commits': _p_deprecated_block(() => {
                                    const value = iterator.look()
                                    return value === null
                                        ? false
                                        : value[0] === "accept-broken"
                                            ? _p_deprecated_block(() => {
                                                iterator.discard(() => null)
                                                return true
                                            })
                                            : false
                                }),
                            }]
                            case 'update-dependencies': return ['update package dependencies', null]
                            default: return abort(['expected one of', _p.dictionary.literal({
                                'assert-clean': null,
                                'build-and-test': null,
                                'git-commit': null,
                                'update-dependencies': null,
                            })])
                        }
                    },
                    () => abort(['expected one of', _p.dictionary.literal({
                        'assert-clean': null,
                        'build-and-test': null,
                        'git-commit': null,
                        'update-dependencies': null,
                    })])
                )

            }]
            case 'project': return ['project', {
                'path': ds_context_path.Context_Path(iterator.consume(
                    ($) => $,
                    () => abort(['expected a text', { 'description': "path to package" }])
                )),
                'instruction': iterator.consume(
                    ($) => {
                        switch ($) {
                            case 'analyze-file-structure': return ['analyze file structure', null]
                            case 'dependency-graph': return ['dependency graph', null]
                            case 'list-file-structure-problems': return ['list file structure problems', null]
                            default: return abort(['expected one of', _p.dictionary.literal({
                                'analyze-file-structure': null,
                                'dependency-graph': null,
                                'list-file-structure-problems': null,
                            })])
                        }
                    },
                    () => abort(['expected one of', _p.dictionary.literal({
                        'analyze-file-structure': null,
                        'dependency-graph': null,
                        'list-file-structure-problems': null,
                    })])
                )

            }]
            case 'publish': return ['publish', {
                'path to package': ds_context_path.Context_Path(iterator.consume(
                    ($) => $,
                    () => abort(['expected a text', { 'description': "path to package" }])
                )),
                'generation': iterator.consume(
                    ($) => {
                        switch ($) {
                            case 'patch': return ['patch', null]
                            case 'minor': return ['minor', null]
                            default: return abort(['expected one of', _p.dictionary.literal({
                                'patch': null,
                                'minor': null,
                            })])
                        }
                    },
                    () => abort(['expected one of', _p.dictionary.literal({
                        'patch': null,
                        'minor': null,
                    })])
                ),
                'impact': _p_deprecated_block(() => {
                    const value = iterator.look()
                    if (value === null) {
                        return abort(['expected a text', { 'description': "'--dry-run' or a one time password" }])
                    } else {
                        switch (value[0]) {
                            case '--dry-run': {
                                iterator.discard(() => null)
                                return ['dry run', null]
                            }
                            default: return ['actual publish', {
                                'one time password': iterator.consume(
                                    ($) => $,
                                    () => abort(['expected a text', { 'description': "one time password" }])
                                )
                            }]
                        }
                    }
                }),
            }]
            case 'set-up-comparison': return ['set up comparison', {
                'path to package': ds_context_path.Context_Path(iterator.consume(
                    ($) => $,
                    () => abort(['expected a text', { 'description': "path to package" }])
                ))
            }]
            default: return abort(['expected one of', _p.dictionary.literal({
                'all': null,
                'package': null,
                'project': null,
                'publish': null,
                'set-up-comparison': null,
            })])
        }
    },
    () => abort(['expected one of', _p.dictionary.literal({
        'all': null,
        'package': null,
        'project': null,
        'publish': null,
        'set-up-comparison': null,
    })])
)