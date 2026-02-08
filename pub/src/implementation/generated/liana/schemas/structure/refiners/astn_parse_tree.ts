
import * as _p from 'pareto-core/dist/assign'

import _p_change_context from 'pareto-core/dist/_p_change_context'

import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/unmarshall"

import * as t_out from "../../../../../../interface/generated/liana/schemas/structure/data"

import * as v_deserialize_number from "liana-core/dist/implementation/manual/primitives/integer/deserializers/decimal"

import * as v_deserialize_boolean from "liana-core/dist/implementation/manual/primitives/boolean/deserializers/true_false"

import * as v_unmarshalled_from_parse_tree from "astn-core/dist/implementation/manual/schemas/unmarshalled/refiners/parse_tree"

import * as v_parse_tree_to_location from "astn-core/dist/implementation/manual/schemas/parse_tree/transformers/location"

export const Directory: t_signatures.Directory = ($, abort) => _p_change_context(
    v_unmarshalled_from_parse_tree.State(
        $,
        ($) => abort(
            ['expected a state', null],
        ),
    ),
    ($) => _p.decide.text(
        $['option']['value'],
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
                        ($) => ['group', _p.dictionary.from.dictionary(
                            v_unmarshalled_from_parse_tree.Dictionary(
                                $,
                                ($) => abort(
                                    ['expected a dictionary', null],
                                ),
                            ),
                        ).map(
                            ($, id) => _p_change_context(
                                v_unmarshalled_from_parse_tree.State(
                                    $,
                                    ($) => abort(
                                        ['expected a state', null],
                                    ),
                                ),
                                ($) => _p.decide.text(
                                    $['option']['value'],
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
                                                                ['expected a state', null],
                                                            ),
                                                        ),
                                                        ($) => _p.decide.text(
                                                            $['option']['value'],
                                                            ($t): t_out.Directory.group.D.file => {
                                                                switch ($t) {
                                                                    case 'manual':
                                                                        return _p_change_context(
                                                                            $['value'],
                                                                            ($) => ['manual', v_unmarshalled_from_parse_tree.Nothing(
                                                                                $,
                                                                                ($) => abort(
                                                                                    ['expected a nothing', null],
                                                                                ),
                                                                            )],
                                                                        )
                                                                    case 'generated':
                                                                        return _p_change_context(
                                                                            $['value'],
                                                                            ($) => ['generated', _p_change_context(
                                                                                v_unmarshalled_from_parse_tree.Group(
                                                                                    $,
                                                                                    ($) => abort(
                                                                                        ['expected a group', null],
                                                                                    ),
                                                                                ),
                                                                                ($) => ({
                                                                                    'commit to git': _p_change_context(
                                                                                        $.__get_entry_deprecated(
                                                                                            'commit to git',
                                                                                            {
                                                                                                no_such_entry: ($) => abort(
                                                                                                    ['no such entry', "commit to git"],
                                                                                                ),
                                                                                            },
                                                                                        ),
                                                                                        ($) => v_deserialize_boolean.deserialize(
                                                                                            _p_list_from_text(
                                                                                                v_unmarshalled_from_parse_tree.Text(
                                                                                                    $,
                                                                                                    ($) => abort(
                                                                                                        ['expected a text', null],
                                                                                                    ),
                                                                                                ),
                                                                                                ($) => $,
                                                                                            ),
                                                                                            ($) => abort(
                                                                                                ['not a valid boolean', null],
                                                                                            ),
                                                                                        ),
                                                                                    ),
                                                                                }),
                                                                            )],
                                                                        )
                                                                    default:
                                                                        return abort(
                                                                            ['unknown option', $['option']['value']],
                                                                        )
                                                                }
                                                            },
                                                        ),
                                                    )],
                                                )
                                            default:
                                                return abort(
                                                    ['unknown option', $['option']['value']],
                                                )
                                        }
                                    },
                                ),
                            ),
                        )],
                    )
                case 'wildcards':
                    return _p_change_context(
                        $['value'],
                        ($) => ['wildcards', _p_change_context(
                            v_unmarshalled_from_parse_tree.Group(
                                $,
                                ($) => abort(
                                    ['expected a group', null],
                                ),
                            ),
                            ($) => ({
                                'required directories': _p_change_context(
                                    $.__get_entry_deprecated(
                                        'required directories',
                                        {
                                            no_such_entry: ($) => abort(
                                                ['no such entry', "required directories"],
                                            ),
                                        },
                                    ),
                                    ($) => v_deserialize_number.deserialize(
                                        _p_list_from_text(
                                            v_unmarshalled_from_parse_tree.Text(
                                                $,
                                                ($) => abort(
                                                    ['expected a text', null],
                                                ),
                                            ),
                                            ($) => $,
                                        ),
                                        ($) => abort(
                                            ['not a valid number', null],
                                        ),
                                    ),
                                ),
                                'additional directories allowed': _p_change_context(
                                    $.__get_entry_deprecated(
                                        'additional directories allowed',
                                        {
                                            no_such_entry: ($) => abort(
                                                ['no such entry', "additional directories allowed"],
                                            ),
                                        },
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        _p_list_from_text(
                                            v_unmarshalled_from_parse_tree.Text(
                                                $,
                                                ($) => abort(
                                                    ['expected a text', null],
                                                ),
                                            ),
                                            ($) => $,
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null],
                                        ),
                                    ),
                                ),
                                'extensions': _p_change_context(
                                    $.__get_entry_deprecated(
                                        'extensions',
                                        {
                                            no_such_entry: ($) => abort(
                                                ['no such entry', "extensions"],
                                            ),
                                        },
                                    ),
                                    ($) => _p.list.from.list(
                                        v_unmarshalled_from_parse_tree.List(
                                            $,
                                            ($) => abort(
                                                ['expected a list', null],
                                            ),
                                        ),
                                    ).map(
                                        ($) => v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null],
                                            ),
                                        ),
                                    ),
                                ),
                                'warn': _p_change_context(
                                    $.__get_entry_deprecated(
                                        'warn',
                                        {
                                            no_such_entry: ($) => abort(
                                                ['no such entry', "warn"],
                                            ),
                                        },
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        _p_list_from_text(
                                            v_unmarshalled_from_parse_tree.Text(
                                                $,
                                                ($) => abort(
                                                    ['expected a text', null],
                                                ),
                                            ),
                                            ($) => $,
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null],
                                        ),
                                    ),
                                ),
                            }),
                        )],
                    )
                case 'freeform':
                    return _p_change_context(
                        $['value'],
                        ($) => ['freeform', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                ['expected a nothing', null],
                            ),
                        )],
                    )
                case 'ignore':
                    return _p_change_context(
                        $['value'],
                        ($) => ['ignore', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                ['expected a nothing', null],
                            ),
                        )],
                    )
                case 'generated':
                    return _p_change_context(
                        $['value'],
                        ($) => ['generated', _p_change_context(
                            v_unmarshalled_from_parse_tree.Group(
                                $,
                                ($) => abort(
                                    ['expected a group', null],
                                ),
                            ),
                            ($) => ({
                                'commit to git': _p_change_context(
                                    $.__get_entry_deprecated(
                                        'commit to git',
                                        {
                                            no_such_entry: ($) => abort(
                                                ['no such entry', "commit to git"],
                                            ),
                                        },
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        _p_list_from_text(
                                            v_unmarshalled_from_parse_tree.Text(
                                                $,
                                                ($) => abort(
                                                    ['expected a text', null],
                                                ),
                                            ),
                                            ($) => $,
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null],
                                        ),
                                    ),
                                ),
                            }),
                        )],
                    )
                default:
                    return abort(
                        ['unknown option', $['option']['value']],
                    )
            }
        },
    ),
)
