
import * as _p from "pareto-core/dist/refiner"

import {
    _p_cc,
} from "pareto-core/dist/change_context"

import * as t_signatures from "../../../../../interface/generated/liana/schemas/structure/unmarshall"

import * as t_out from "../../../../../interface/generated/liana/schemas/structure/data"

import * as v_deserialize_number from "liana-core/dist/implementation/manual/primitives/integer/deserializers/decimal"

import * as v_deserialize_boolean from "liana-core/dist/implementation/manual/primitives/boolean/deserializers/true_false"

import * as v_unmarshalled_from_parse_tree from "astn-core/dist/implementation/manual/schemas/unmarshalled/refiners/parse_tree"

import * as v_parse_tree_to_location from "astn-core/dist/implementation/manual/schemas/parse_tree/transformers/location"

export const Directory: t_signatures.Directory = ($, abort) => _p_cc(
    v_unmarshalled_from_parse_tree.State(
        $,
        ($) => abort(
            ['expected a state', null]
        )
    ),
    ($) => _p.decide.text(
        $['option']['value'],
        ($t): t_out.Directory => {
            switch ($t) {
                case 'dictionary':
                    return _p_cc(
                        $['value'],
                        ($) => ['dictionary', Directory(
                            $,
                            ($) => abort(
                                $
                            )
                        )]
                    )
                case 'group':
                    return _p_cc(
                        $['value'],
                        ($) => ['group', v_unmarshalled_from_parse_tree.Dictionary(
                            $,
                            ($) => abort(
                                ['expected a dictionary', null]
                            )
                        ).__d_map(
                            ($, id) => _p_cc(
                                v_unmarshalled_from_parse_tree.State(
                                    $,
                                    ($) => abort(
                                        ['expected a state', null]
                                    )
                                ),
                                ($) => _p.decide.text(
                                    $['option']['value'],
                                    ($t): t_out.Directory.group.D => {
                                        switch ($t) {
                                            case 'directory':
                                                return _p_cc(
                                                    $['value'],
                                                    ($) => ['directory', Directory(
                                                        $,
                                                        ($) => abort(
                                                            $
                                                        )
                                                    )]
                                                )
                                            case 'file':
                                                return _p_cc(
                                                    $['value'],
                                                    ($) => ['file', _p_cc(
                                                        v_unmarshalled_from_parse_tree.State(
                                                            $,
                                                            ($) => abort(
                                                                ['expected a state', null]
                                                            )
                                                        ),
                                                        ($) => _p.decide.text(
                                                            $['option']['value'],
                                                            ($t): t_out.Directory.group.D.file => {
                                                                switch ($t) {
                                                                    case 'manual':
                                                                        return _p_cc(
                                                                            $['value'],
                                                                            ($) => ['manual', v_unmarshalled_from_parse_tree.Nothing(
                                                                                $,
                                                                                ($) => abort(
                                                                                    ['expected a nothing', null]
                                                                                )
                                                                            )]
                                                                        )
                                                                    case 'generated':
                                                                        return _p_cc(
                                                                            $['value'],
                                                                            ($) => ['generated', _p_cc(
                                                                                v_unmarshalled_from_parse_tree.Group(
                                                                                    $,
                                                                                    ($) => abort(
                                                                                        ['expected a group', null]
                                                                                    )
                                                                                ),
                                                                                ($) => ({
                                                                                    'commit to git': _p_cc(
                                                                                        $.__get_entry(
                                                                                            'commit to git',
                                                                                            ($) => abort(
                                                                                                ['no such entry', "commit to git"]
                                                                                            )
                                                                                        ),
                                                                                        ($) => v_deserialize_boolean.deserialize(
                                                                                            v_unmarshalled_from_parse_tree.Text(
                                                                                                $,
                                                                                                ($) => abort(
                                                                                                    ['expected a text', null]
                                                                                                )
                                                                                            ),
                                                                                            ($) => abort(
                                                                                                ['not a valid boolean', null]
                                                                                            )
                                                                                        )
                                                                                    ),
                                                                                })
                                                                            )]
                                                                        )
                                                                    default:
                                                                        return abort(
                                                                            ['unknown option', $['option']['value']]
                                                                        )
                                                                }
                                                            }
                                                        )
                                                    )]
                                                )
                                            default:
                                                return abort(
                                                    ['unknown option', $['option']['value']]
                                                )
                                        }
                                    }
                                )
                            )
                        )]
                    )
                case 'wildcards':
                    return _p_cc(
                        $['value'],
                        ($) => ['wildcards', _p_cc(
                            v_unmarshalled_from_parse_tree.Group(
                                $,
                                ($) => abort(
                                    ['expected a group', null]
                                )
                            ),
                            ($) => ({
                                'required directories': _p_cc(
                                    $.__get_entry(
                                        'required directories',
                                        ($) => abort(
                                            ['no such entry', "required directories"]
                                        )
                                    ),
                                    ($) => v_deserialize_number.deserialize(
                                        v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null]
                                            )
                                        ),
                                        ($) => abort(
                                            ['not a valid number', null]
                                        )
                                    )
                                ),
                                'additional directories allowed': _p_cc(
                                    $.__get_entry(
                                        'additional directories allowed',
                                        ($) => abort(
                                            ['no such entry', "additional directories allowed"]
                                        )
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null]
                                            )
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null]
                                        )
                                    )
                                ),
                                'extensions': _p_cc(
                                    $.__get_entry(
                                        'extensions',
                                        ($) => abort(
                                            ['no such entry', "extensions"]
                                        )
                                    ),
                                    ($) => v_unmarshalled_from_parse_tree.List(
                                        $,
                                        ($) => abort(
                                            ['expected a list', null]
                                        )
                                    ).__l_map(
                                        ($) => v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null]
                                            )
                                        )
                                    )
                                ),
                                'warn': _p_cc(
                                    $.__get_entry(
                                        'warn',
                                        ($) => abort(
                                            ['no such entry', "warn"]
                                        )
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null]
                                            )
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null]
                                        )
                                    )
                                ),
                            })
                        )]
                    )
                case 'freeform':
                    return _p_cc(
                        $['value'],
                        ($) => ['freeform', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                ['expected a nothing', null]
                            )
                        )]
                    )
                case 'ignore':
                    return _p_cc(
                        $['value'],
                        ($) => ['ignore', v_unmarshalled_from_parse_tree.Nothing(
                            $,
                            ($) => abort(
                                ['expected a nothing', null]
                            )
                        )]
                    )
                case 'generated':
                    return _p_cc(
                        $['value'],
                        ($) => ['generated', _p_cc(
                            v_unmarshalled_from_parse_tree.Group(
                                $,
                                ($) => abort(
                                    ['expected a group', null]
                                )
                            ),
                            ($) => ({
                                'commit to git': _p_cc(
                                    $.__get_entry(
                                        'commit to git',
                                        ($) => abort(
                                            ['no such entry', "commit to git"]
                                        )
                                    ),
                                    ($) => v_deserialize_boolean.deserialize(
                                        v_unmarshalled_from_parse_tree.Text(
                                            $,
                                            ($) => abort(
                                                ['expected a text', null]
                                            )
                                        ),
                                        ($) => abort(
                                            ['not a valid boolean', null]
                                        )
                                    )
                                ),
                            })
                        )]
                    )
                default:
                    return abort(
                        ['unknown option', $['option']['value']]
                    )
            }
        }
    )
)
