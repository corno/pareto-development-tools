
import * as p_ from 'pareto-core/implementation/transformer'

import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

import _p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/signatures/transformers/astn_sealed_target.js"

import * as t_out from "astn-core/interface/generated/liana/schemas/sealed_target/data"

import * as v_primitives_to_text from "liana-core/implementation/manual/transformers/primitives/text"

const p_decide_state = <State, B>($: State,  assign: ($: State) => B) => assign($)

export const Directory: t_signatures.Directory = ($) => ['state', p_decide_state(
    $,
    ($): t_out.Value.state => {
        switch ($[0]) {
            case 'dictionary':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'dictionary',
                        'value': Directory(
                            $,
                        ),
                    }),
                )
            case 'group':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'group',
                        'value': ['dictionary', p_.from.dictionary($,
                        ).map(
                            ($, id): t_out.Value => ['state', p_decide_state(
                                $,
                                ($): t_out.Value.state => {
                                    switch ($[0]) {
                                        case 'directory':
                                            return p_.option(
                                                $,
                                                ($) => ({
                                                    'option': 'directory',
                                                    'value': Directory(
                                                        $,
                                                    ),
                                                }),
                                            )
                                        case 'file':
                                            return p_.option(
                                                $,
                                                ($) => ({
                                                    'option': 'file',
                                                    'value': ['state', p_decide_state(
                                                        $,
                                                        ($): t_out.Value.state => {
                                                            switch ($[0]) {
                                                                case 'manual':
                                                                    return p_.option(
                                                                        $,
                                                                        ($) => ({
                                                                            'option': 'manual',
                                                                            'value': ['nothing', null],
                                                                        }),
                                                                    )
                                                                case 'generated':
                                                                    return p_.option(
                                                                        $,
                                                                        ($) => ({
                                                                            'option': 'generated',
                                                                            'value': ['group', ['verbose', p_.literal.dictionary(
                                                                                {
                                                                                    "commit to git": p_change_context(
                                                                                        $['commit to git'],
                                                                                        ($) => ['text', {
                                                                                            'delimiter': ['none', null],
                                                                                            'value': v_primitives_to_text.true_false(
                                                                                                $,
                                                                                            ),
                                                                                        }],
                                                                                    ),
                                                                                },
                                                                            )]],
                                                                        }),
                                                                    )
                                                                default:
                                                                    return p_.au(
                                                                        $[0],
                                                                    )
                                                            }
                                                        },
                                                    )],
                                                }),
                                            )
                                        default:
                                            return p_.au(
                                                $[0],
                                            )
                                    }
                                },
                            )],
                        )],
                    }),
                )
            case 'wildcards':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'wildcards',
                        'value': ['group', ['verbose', p_.literal.dictionary(
                            {
                                "required directories": p_change_context(
                                    $['required directories'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': v_primitives_to_text.decimal(
                                            $,
                                        ),
                                    }],
                                ),
                                "additional directories allowed": p_change_context(
                                    $['additional directories allowed'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': v_primitives_to_text.true_false(
                                            $,
                                        ),
                                    }],
                                ),
                                "extensions": p_change_context(
                                    $['extensions'],
                                    ($) => ['list', p_.from.list($,
                                    ).map(
                                        ($) => ['text', {
                                            'delimiter': ['quote', null],
                                            'value': $,
                                        }],
                                    )],
                                ),
                                "warn": p_change_context(
                                    $['warn'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': v_primitives_to_text.true_false(
                                            $,
                                        ),
                                    }],
                                ),
                            },
                        )]],
                    }),
                )
            case 'freeform':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'freeform',
                        'value': ['nothing', null],
                    }),
                )
            case 'ignore':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'ignore',
                        'value': ['nothing', null],
                    }),
                )
            case 'generated':
                return p_.option(
                    $,
                    ($) => ({
                        'option': 'generated',
                        'value': ['group', ['verbose', p_.literal.dictionary(
                            {
                                "commit to git": p_change_context(
                                    $['commit to git'],
                                    ($) => ['text', {
                                        'delimiter': ['none', null],
                                        'value': v_primitives_to_text.true_false(
                                            $,
                                        ),
                                    }],
                                ),
                            },
                        )]],
                    }),
                )
            default:
                return p_.au(
                    $[0],
                )
        }
    },
)]
