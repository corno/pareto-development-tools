
import * as _p from 'pareto-core/dist/assign'

import _p_change_context from 'pareto-core/dist/implementation/specials/change_context'

import _p_list_from_text from 'pareto-core/dist/implementation/specials/list_from_text'

import _p_variables from 'pareto-core/dist/implementation/specials/variables'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/signatures/refiners/astn_parse_tree"

import * as t_out from "../../../../../../interface/generated/liana/schemas/structure/data"

import * as v_unmarshalled_from_parse_tree from "liana-core/dist/implementation/manual/refiners/unmarshalled/astn_parse_tree"

import * as v_parse_tree_to_location from "liana-core/dist/implementation/manual/transformers/parse_tree/start_token_range"

export const Directory: t_signatures.Directory = ($, abort) => _p_change_context(
    v_unmarshalled_from_parse_tree.State(
        $,
        ($) => abort(
            $,
        ),
    ),
    ($) => _p.decide.text(
        $['option']['token']['value'],
        ($t): t_out.Directory => {
            switch ($t) {
                case 'dictionary':
                    return _p_change_context(
                        $['value'],
                        ($) => ['dictionary', Directory(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case 'group':
                    return _p_change_context(
                        $['value'],
                        ($) => ['group', _p_change_context(
                            v_unmarshalled_from_parse_tree.Dictionary(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'subdocument context': _p.literal.not_set(),
                                },
                            ),
                            ($) => _p.dictionary.from.dictionary(
                                $['entries'],
                            ).map(
                                ($, id) => _p_change_context(
                                    v_unmarshalled_from_parse_tree.State(
                                        $,
                                        ($) => abort(
                                            $,
                                        ),
                                    ),
                                    ($) => _p.decide.text(
                                        $['option']['token']['value'],
                                        ($t): t_out.Directory.group.D => {
                                            switch ($t) {
                                                case 'directory':
                                                    return _p_change_context(
                                                        $['value'],
                                                        ($) => ['directory', Directory(
                                                            $,
                                                            ($) => abort(
                                                                $,
                                                            ),
                                                        )],
                                                    )
                                                case 'file':
                                                    return _p_change_context(
                                                        $['value'],
                                                        ($) => ['file', _p_change_context(
                                                            v_unmarshalled_from_parse_tree.State(
                                                                $,
                                                                ($) => abort(
                                                                    $,
                                                                ),
                                                            ),
                                                            ($) => _p.decide.text(
                                                                $['option']['token']['value'],
                                                                ($t): t_out.Directory.group.D.file => {
                                                                    switch ($t) {
                                                                        case 'manual':
                                                                            return _p_change_context(
                                                                                $['value'],
                                                                                ($) => ['manual', v_unmarshalled_from_parse_tree.Nothing(
                                                                                    $,
                                                                                    ($) => abort(
                                                                                        $,
                                                                                    ),
                                                                                )],
                                                                            )
                                                                        case 'generated':
                                                                            return _p_change_context(
                                                                                $['value'],
                                                                                ($) => ['generated', _p_change_context(
                                                                                    v_unmarshalled_from_parse_tree.Verbose_Group(
                                                                                        $,
                                                                                        ($) => abort(
                                                                                            $,
                                                                                        ),
                                                                                        {
                                                                                            'expected properties': _p.literal.dictionary(
                                                                                                {
                                                                                                    "commit to git": null,
                                                                                                },
                                                                                            ),
                                                                                            'subdocument context': _p.literal.not_set(),
                                                                                        },
                                                                                    ),
                                                                                    ($) => _p_variables(
                                                                                        () => {
                                                                                            
                                                                                            const var_verbose_group_range = v_parse_tree_to_location.Value(
                                                                                                $['value'],
                                                                                                {
                                                                                                    'subdocument context': _p.literal.not_set(),
                                                                                                },
                                                                                            )
                                                                                            return {
                                                                                                'commit to git': _p_change_context(
                                                                                                    v_unmarshalled_from_parse_tree.Property(
                                                                                                        $,
                                                                                                        ($) => abort(
                                                                                                            $,
                                                                                                        ),
                                                                                                        {
                                                                                                            'id': 'commit to git',
                                                                                                            'subdocument context': _p.literal.not_set(),
                                                                                                        },
                                                                                                    ),
                                                                                                    ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                                                                        $,
                                                                                                        ($) => abort(
                                                                                                            $,
                                                                                                        ),
                                                                                                        {
                                                                                                            'type': ['true/false', null],
                                                                                                            'subdocument context': _p.literal.not_set(),
                                                                                                        },
                                                                                                    ),
                                                                                                ),
                                                                                            }
                                                                                        },
                                                                                    ),
                                                                                )],
                                                                            )
                                                                        default:
                                                                            return abort(
                                                                                ['liana', {
                                                                                    'type': ['state', ['unknown option', $['option']['token']['value']]],
                                                                                    'range': v_parse_tree_to_location.Value(
                                                                                        $['value'],
                                                                                        {
                                                                                            'subdocument context': _p.literal.not_set(),
                                                                                        },
                                                                                    ),
                                                                                }],
                                                                            )
                                                                    }
                                                                },
                                                            ),
                                                        )],
                                                    )
                                                default:
                                                    return abort(
                                                        ['liana', {
                                                            'type': ['state', ['unknown option', $['option']['token']['value']]],
                                                            'range': v_parse_tree_to_location.Value(
                                                                $['value'],
                                                                {
                                                                    'subdocument context': _p.literal.not_set(),
                                                                },
                                                            ),
                                                        }],
                                                    )
                                            }
                                        },
                                    ),
                                ),
                            ),
                        )],
                    )
                case 'wildcards':
                    return _p_change_context(
                        $['value'],
                        ($) => ['wildcards', _p_change_context(
                            v_unmarshalled_from_parse_tree.Verbose_Group(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'expected properties': _p.literal.dictionary(
                                        {
                                            "required directories": null,
                                            "additional directories allowed": null,
                                            "extensions": null,
                                            "warn": null,
                                        },
                                    ),
                                    'subdocument context': _p.literal.not_set(),
                                },
                            ),
                            ($) => _p_variables(
                                () => {
                                    
                                    const var_verbose_group_range = v_parse_tree_to_location.Value(
                                        $['value'],
                                        {
                                            'subdocument context': _p.literal.not_set(),
                                        },
                                    )
                                    return {
                                        'required directories': _p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'required directories',
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Number(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['decimal', null],
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                        ),
                                        'additional directories allowed': _p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'additional directories allowed',
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                        ),
                                        'extensions': _p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'extensions',
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                            ($) => _p.list.from.list(
                                                v_unmarshalled_from_parse_tree.List(
                                                    $,
                                                    ($) => abort(
                                                        $,
                                                    ),
                                                    {
                                                        'subdocument context': _p.literal.not_set(),
                                                    },
                                                )['items'],
                                            ).map(
                                                ($) => _p_change_context(
                                                    $['value'],
                                                    ($) => v_unmarshalled_from_parse_tree.Text(
                                                        $,
                                                        ($) => abort(
                                                            $,
                                                        ),
                                                    ),
                                                ),
                                            ),
                                        ),
                                        'warn': _p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'warn',
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                        ),
                                    }
                                },
                            ),
                        )],
                    )
                case 'freeform':
                    return _p_change_context(
                        $['value'],
                        ($) => ['freeform', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case 'ignore':
                    return _p_change_context(
                        $['value'],
                        ($) => ['ignore', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case 'generated':
                    return _p_change_context(
                        $['value'],
                        ($) => ['generated', _p_change_context(
                            v_unmarshalled_from_parse_tree.Verbose_Group(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'expected properties': _p.literal.dictionary(
                                        {
                                            "commit to git": null,
                                        },
                                    ),
                                    'subdocument context': _p.literal.not_set(),
                                },
                            ),
                            ($) => _p_variables(
                                () => {
                                    
                                    const var_verbose_group_range = v_parse_tree_to_location.Value(
                                        $['value'],
                                        {
                                            'subdocument context': _p.literal.not_set(),
                                        },
                                    )
                                    return {
                                        'commit to git': _p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'commit to git',
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': _p.literal.not_set(),
                                                },
                                            ),
                                        ),
                                    }
                                },
                            ),
                        )],
                    )
                default:
                    return abort(
                        ['liana', {
                            'type': ['state', ['unknown option', $['option']['token']['value']]],
                            'range': v_parse_tree_to_location.Value(
                                $['value'],
                                {
                                    'subdocument context': _p.literal.not_set(),
                                },
                            ),
                        }],
                    )
            }
        },
    ),
)
