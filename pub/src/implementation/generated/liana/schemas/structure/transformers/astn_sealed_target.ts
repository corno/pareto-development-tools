
import * as _p from 'pareto-core/dist/assign'

import _p_change_context from 'pareto-core/dist/_p_change_context'

import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/marshall"

import * as t_out from "astn-core/dist/interface/generated/liana/schemas/sealed_target/data"

import * as v_serialize_number from "liana-core/dist/implementation/manual/primitives/integer/serializers/decimal"

import * as v_serialize_boolean from "liana-core/dist/implementation/manual/primitives/boolean/serializers/true_false"

export const Directory: t_signatures.Directory = ($) => ['state', _p.decide.state(
    $,
    ($): t_out.Value.state => {
        switch ($[0]) {
            case 'dictionary':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'dictionary',
                        'value': Directory(
                            $,
                        ),
                    }),
                )
            case 'group':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'group',
                        'value': ['dictionary', _p.dictionary.from.dictionary(
                            $,
                        ).map(
                            ($, id) => ['state', _p.decide.state(
                                $,
                                ($): t_out.Value.state => {
                                    switch ($[0]) {
                                        case 'directory':
                                            return _p.ss(
                                                $,
                                                ($) => ({
                                                    'option': 'directory',
                                                    'value': Directory(
                                                        $,
                                                    ),
                                                }),
                                            )
                                        case 'file':
                                            return _p.ss(
                                                $,
                                                ($) => ({
                                                    'option': 'file',
                                                    'value': ['state', _p.decide.state(
                                                        $,
                                                        ($): t_out.Value.state => {
                                                            switch ($[0]) {
                                                                case 'manual':
                                                                    return _p.ss(
                                                                        $,
                                                                        ($) => ({
                                                                            'option': 'manual',
                                                                            'value': ['nothing', null],
                                                                        }),
                                                                    )
                                                                case 'generated':
                                                                    return _p.ss(
                                                                        $,
                                                                        ($) => ({
                                                                            'option': 'generated',
                                                                            'value': ['group', ['verbose', _p.dictionary.literal(
                                                                                {
                                                                                    "commit to git": _p_change_context(
                                                                                        $['commit to git'],
                                                                                        ($) => ['text', {
                                                                                            'delimiter': ['none', null],
                                                                                            'value': _p_text_from_list(
                                                                                                v_serialize_boolean.serialize(
                                                                                                    $,
                                                                                                ),
                                                                                                ($) => $,
                                                                                            ),
                                                                                        }],
                                                                                    ),
                                                                                },
                                                                            )]],
                                                                        }),
                                                                    )
                                                                default:
                                                                    return _p.au(
                                                                        $[0],
                                                                    )
                                                            }
                                                        },
                                                    )],
                                                }),
                                            )
                                        default:
                                            return _p.au(
                                                $[0],
                                            )
                                    }
                                },
                            )],
                        )],
                    }),
                )
            case 'wildcards':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'wildcards',
                        'value': ['group', ['verbose', _p.dictionary.literal(
                            {
                                "required directories": _p_change_context(
                                    $['required directories'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': _p_text_from_list(
                                            v_serialize_number.serialize(
                                                $,
                                            ),
                                            ($) => $,
                                        ),
                                    }],
                                ),
                                "additional directories allowed": _p_change_context(
                                    $['additional directories allowed'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': _p_text_from_list(
                                            v_serialize_boolean.serialize(
                                                $,
                                            ),
                                            ($) => $,
                                        ),
                                    }],
                                ),
                                "extensions": _p_change_context(
                                    $['extensions'],
                                    ($) => ['list', _p.list.from.list(
                                        $,
                                    ).map(
                                        ($) => ['text', {
                                            'delimiter': ['quote', null],
                                            'value': $,
                                        }],
                                    )],
                                ),
                                "warn": _p_change_context(
                                    $['warn'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': _p_text_from_list(
                                            v_serialize_boolean.serialize(
                                                $,
                                            ),
                                            ($) => $,
                                        ),
                                    }],
                                ),
                            },
                        )]],
                    }),
                )
            case 'freeform':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'freeform',
                        'value': ['nothing', null],
                    }),
                )
            case 'ignore':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'ignore',
                        'value': ['nothing', null],
                    }),
                )
            case 'generated':
                return _p.ss(
                    $,
                    ($) => ({
                        'option': 'generated',
                        'value': ['group', ['verbose', _p.dictionary.literal(
                            {
                                "commit to git": _p_change_context(
                                    $['commit to git'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': _p_text_from_list(
                                            v_serialize_boolean.serialize(
                                                $,
                                            ),
                                            ($) => $,
                                        ),
                                    }],
                                ),
                            },
                        )]],
                    }),
                )
            default:
                return _p.au(
                    $[0],
                )
        }
    },
)]
