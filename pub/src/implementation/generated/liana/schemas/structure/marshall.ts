
import * as _p from "pareto-core/dist/transformer"

import * as t_signatures from "../../../../../interface/generated/liana/schemas/structure/marshall"

import * as t_out from "astn-core/dist/interface/generated/liana/schemas/sealed_target/data"

import * as v_serialize_number from "liana-core/dist/implementation/manual/primitives/integer/serializers/decimal"

import * as v_serialize_boolean from "liana-core/dist/implementation/manual/primitives/boolean/serializers/true_false"
export const Directory: t_signatures.Directory = ($,) => ['state', _p.decide.state($, ($,): t_out.Value.state => {
    switch ($[0]) {
        case 'dictionary':
            return _p.ss($, ($,) => ({
                'option': 'dictionary',
                'value': Directory($),
            }))
        case 'group':
            return _p.ss($, ($,) => ({
                'option': 'group',
                'value': ['dictionary', $.__d_map(($,id,) => ['state', _p.decide.state($, ($,): t_out.Value.state => {
                    switch ($[0]) {
                        case 'directory':
                            return _p.ss($, ($,) => ({
                                'option': 'directory',
                                'value': Directory($),
                            }))
                        case 'file':
                            return _p.ss($, ($,) => ({
                                'option': 'file',
                                'value': ['state', _p.decide.state($, ($,): t_out.Value.state => {
                                    switch ($[0]) {
                                        case 'manual':
                                            return _p.ss($, ($,) => ({
                                                'option': 'manual',
                                                'value': ['nothing', null],
                                            }))
                                        case 'generated':
                                            return _p.ss($, ($,) => ({
                                                'option': 'generated',
                                                'value': ['group', ['verbose', _p.dictionary.literal(({
                                                    'commit to git': _p.deprecated_cc($['commit to git'], ($,) => ['text', ({
                                                        'delimiter': ['none', null],
                                                        'value': v_serialize_boolean.serialize($),
                                                    })]),
                                                }))]],
                                            }))
                                        default:
                                            return _p.au($[0])
                                    }
                                })],
                            }))
                        default:
                            return _p.au($[0])
                    }
                })])],
            }))
        case 'wildcards':
            return _p.ss($, ($,) => ({
                'option': 'wildcards',
                'value': ['group', ['verbose', _p.dictionary.literal(({
                    'required directories': _p.deprecated_cc($['required directories'], ($,) => ['text', ({
                        'delimiter': ['none', null],
                        'value': v_serialize_number.serialize($),
                    })]),
                    'additional directories allowed': _p.deprecated_cc($['additional directories allowed'], ($,) => ['text', ({
                        'delimiter': ['none', null],
                        'value': v_serialize_boolean.serialize($),
                    })]),
                    'extensions': _p.deprecated_cc($['extensions'], ($,) => ['list', $.__l_map(($,) => ['text', ({
                        'delimiter': ['quote', null],
                        'value': $,
                    })])]),
                    'warn': _p.deprecated_cc($['warn'], ($,) => ['text', ({
                        'delimiter': ['none', null],
                        'value': v_serialize_boolean.serialize($),
                    })]),
                }))]],
            }))
        case 'freeform':
            return _p.ss($, ($,) => ({
                'option': 'freeform',
                'value': ['nothing', null],
            }))
        case 'ignore':
            return _p.ss($, ($,) => ({
                'option': 'ignore',
                'value': ['nothing', null],
            }))
        case 'generated':
            return _p.ss($, ($,) => ({
                'option': 'generated',
                'value': ['group', ['verbose', _p.dictionary.literal(({
                    'commit to git': _p.deprecated_cc($['commit to git'], ($,) => ['text', ({
                        'delimiter': ['none', null],
                        'value': v_serialize_boolean.serialize($),
                    })]),
                }))]],
            }))
        default:
            return _p.au($[0])
    }
})]
