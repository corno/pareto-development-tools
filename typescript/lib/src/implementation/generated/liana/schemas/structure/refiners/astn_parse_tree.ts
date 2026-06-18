
import * as p_ from 'pareto-core/dist/implementation/refiner'

import p_change_context from 'pareto-core/dist/implementation/specials/change_context'

import p_list_from_text from 'pareto-core/dist/implementation/specials/list_from_text'

import p_variables from 'pareto-core/dist/implementation/specials/variables'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/signatures/refiners/astn_parse_tree"

import * as t_out from "../../../../../../interface/generated/liana/schemas/structure/data"

import * as v_unmarshalled_from_parse_tree from "liana-core/dist/implementation/manual/refiners/unmarshalled/astn_parse_tree"

import * as v_parse_tree_to_location from "liana-core/dist/implementation/manual/transformers/parse_tree/start_token_range"

export const Directory: t_signatures.Directory = ($, abort) => p_change_context(
    v_unmarshalled_from_parse_tree.State(
        $,
        ($) => abort(
            $,
        ),
    ),
    ($): t_out.Directory => p_.from.text(
        $['option']['token']['value'],
    ).state(
        $, 
        ($, $t): t_out.Directory => {
            switch ($t) {
                case "dictionary":
                    return p_change_context(
                        $['value'],
                        ($): t_out.Directory => ['dictionary', Directory(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case "group":
                    return p_change_context(
                        $['value'],
                        ($): t_out.Directory => ['group', p_change_context(
                            v_unmarshalled_from_parse_tree.Dictionary(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'subdocument context': p_.literal.not_set(),
                                },
                            ),
                            ($) => p_.from.dictionary(
                                $['entries'],
                            ).map(
                                ($, id) => p_change_context(
                                    v_unmarshalled_from_parse_tree.State(
                                        $,
                                        ($) => abort(
                                            $,
                                        ),
                                    ),
                                    ($) => p_.from.text(
                                        $['option']['token']['value'],
                                    ).state($, 
                                        ($, $t): t_out.Directory.group.D => {
                                            switch ($t) {
                                                case 'directory':
                                                    return p_change_context(
                                                        $['value'],
                                                        ($) => ['directory', Directory(
                                                            $,
                                                            ($) => abort(
                                                                $,
                                                            ),
                                                        )],
                                                    )
                                                case 'file':
                                                    return p_change_context(
                                                        $['value'],
                                                        ($) => ['file', p_change_context(
                                                            v_unmarshalled_from_parse_tree.State(
                                                                $,
                                                                ($) => abort(
                                                                    $,
                                                                ),
                                                            ),
                                                            ($) => p_.from.text(
                                                                $['option']['token']['value'],
                                                            ).state($, 
                                                                ($, $t): t_out.Directory.group.D.file => {
                                                                    switch ($t) {
                                                                        case 'manual':
                                                                            return p_change_context(
                                                                                $['value'],
                                                                                ($) => ['manual', v_unmarshalled_from_parse_tree.Nothing(
                                                                                    $,
                                                                                    ($) => abort(
                                                                                        $,
                                                                                    ),
                                                                                )],
                                                                            )
                                                                        case 'generated':
                                                                            return p_change_context(
                                                                                $['value'],
                                                                                ($) => ['generated', p_change_context(
                                                                                    v_unmarshalled_from_parse_tree.Verbose_Group(
                                                                                        $,
                                                                                        ($) => abort(
                                                                                            $,
                                                                                        ),
                                                                                        {
                                                                                            'expected properties': p_.literal.dictionary(
                                                                                                {
                                                                                                    "commit to git": null,
                                                                                                },
                                                                                            ),
                                                                                            'subdocument context': p_.literal.not_set(),
                                                                                        },
                                                                                    ),
                                                                                    ($) => p_variables(
                                                                                        () => {
                                                                                            
                                                                                            const var_verbose_group_range = v_parse_tree_to_location.Value(
                                                                                                $['value'],
                                                                                                {
                                                                                                    'subdocument context': p_.literal.not_set(),
                                                                                                },
                                                                                            )
                                                                                            return {
                                                                                                'commit to git': p_change_context(
                                                                                                    v_unmarshalled_from_parse_tree.Property(
                                                                                                        $,
                                                                                                        ($) => abort(
                                                                                                            $,
                                                                                                        ),
                                                                                                        {
                                                                                                            'id': 'commit to git',
                                                                                                            'subdocument context': p_.literal.not_set(),
                                                                                                        },
                                                                                                    ),
                                                                                                    ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                                                                        $,
                                                                                                        ($) => abort(
                                                                                                            $,
                                                                                                        ),
                                                                                                        {
                                                                                                            'type': ['true/false', null],
                                                                                                            'subdocument context': p_.literal.not_set(),
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
                                                                                            'subdocument context': p_.literal.not_set(),
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
                                                                    'subdocument context': p_.literal.not_set(),
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
                case "wildcards":
                    return p_change_context(
                        $['value'],
                        ($) => ['wildcards', p_change_context(
                            v_unmarshalled_from_parse_tree.Verbose_Group(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'expected properties': p_.literal.dictionary(
                                        {
                                            "required directories": null,
                                            "additional directories allowed": null,
                                            "extensions": null,
                                            "warn": null,
                                        },
                                    ),
                                    'subdocument context': p_.literal.not_set(),
                                },
                            ),
                            ($) => p_variables(
                                () => {
                                    
                                    const var_verbose_group_range = v_parse_tree_to_location.Value(
                                        $['value'],
                                        {
                                            'subdocument context': p_.literal.not_set(),
                                        },
                                    )
                                    return {
                                        'required directories': p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'required directories',
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Number(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['decimal', null],
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                        ),
                                        'additional directories allowed': p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'additional directories allowed',
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                        ),
                                        'extensions': p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'extensions',
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                            ($) => p_.from.list(
                                                v_unmarshalled_from_parse_tree.List(
                                                    $,
                                                    ($) => abort(
                                                        $,
                                                    ),
                                                    {
                                                        'subdocument context': p_.literal.not_set(),
                                                    },
                                                )['items'],
                                            ).map(
                                                ($) => p_change_context(
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
                                        'warn': p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'warn',
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                        ),
                                    }
                                },
                            ),
                        )],
                    )
                case 'freeform':
                    return p_change_context(
                        $['value'],
                        ($) => ['freeform', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case 'ignore':
                    return p_change_context(
                        $['value'],
                        ($) => ['ignore', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                $,
                            ),
                        )],
                    )
                case 'generated':
                    return p_change_context(
                        $['value'],
                        ($) => ['generated', p_change_context(
                            v_unmarshalled_from_parse_tree.Verbose_Group(
                                $,
                                ($) => abort(
                                    $,
                                ),
                                {
                                    'expected properties': p_.literal.dictionary(
                                        {
                                            "commit to git": null,
                                        },
                                    ),
                                    'subdocument context': p_.literal.not_set(),
                                },
                            ),
                            ($) => p_variables(
                                () => {
                                    
                                    const var_verbose_group_range = v_parse_tree_to_location.Value(
                                        $['value'],
                                        {
                                            'subdocument context': p_.literal.not_set(),
                                        },
                                    )
                                    return {
                                        'commit to git': p_change_context(
                                            v_unmarshalled_from_parse_tree.Property(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'id': 'commit to git',
                                                    'subdocument context': p_.literal.not_set(),
                                                },
                                            ),
                                            ($) => v_unmarshalled_from_parse_tree.Boolean(
                                                $,
                                                ($) => abort(
                                                    $,
                                                ),
                                                {
                                                    'type': ['true/false', null],
                                                    'subdocument context': p_.literal.not_set(),
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
                                    'subdocument context': p_.literal.not_set(),
                                },
                            ),
                        }],
                    )
            }
        },
    ),
)
