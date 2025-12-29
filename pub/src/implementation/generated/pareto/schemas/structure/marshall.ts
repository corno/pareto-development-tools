import * as _pa from 'pareto-core-transformer'
import * as _pd from 'pareto-core-dev'

import * as _i_signatures from "../../../../../interface/generated/pareto/schemas/structure/marshall"
import * as _i_out from "../../../../../interface/generated/pareto/core/astn_target"


export const Directory: _i_signatures._T_Directory = ($, $p) => ['state', _pa.cc($, ($): _i_out._T_Value.SG.state => {
    switch ($[0]) {
        case 'dictionary': return _pa.ss($, ($) => ({
            'state': "dictionary",
            'value': Directory(
                $,
                {
                    'value serializers': $p['value serializers'],
                }
            ),
        }))
        case 'group': return _pa.ss($, ($) => ({
            'state': "group",
            'value': ['dictionary', $.map(($) => ['state', _pa.cc($, ($): _i_out._T_Value.SG.state => {
                switch ($[0]) {
                    case 'directory': return _pa.ss($, ($) => ({
                        'state': "directory",
                        'value': Directory(
                            $,
                            {
                                'value serializers': $p['value serializers'],
                            }
                        ),
                    }))
                    case 'file': return _pa.ss($, ($) => ({
                        'state': "file",
                        'value': ['state', _pa.cc($, ($): _i_out._T_Value.SG.state => {
                            switch ($[0]) {
                                case 'manual': return _pa.ss($, ($) => ({
                                    'state': "manual",
                                    'value': ['nothing', null],
                                }))
                                case 'generated': return _pa.ss($, ($) => ({
                                    'state': "generated",
                                    'value': ['verbose group', _pa.dictionary_literal({
                                        'commit to git': _pa.cc($['commit to git'], ($) => ['text', ({
                                            'delimiter': ['backtick', null],
                                            'value': $p['value serializers']['boolean'](
                                                $,
                                                null
                                            ),
                                        })]),
                                    })],
                                }))
                                default: return _pa.au($[0])
                            }
                        })],
                    }))
                    default: return _pa.au($[0])
                }
            })])],
        }))
        case 'wildcards': return _pa.ss($, ($) => ({
            'state': "wildcards",
            'value': ['verbose group', _pa.dictionary_literal({
                'required directories': _pa.cc($['required directories'], ($) => ['text', ({
                    'delimiter': ['backtick', null],
                    'value': $p['value serializers']['default number'](
                        $,
                        null
                    ),
                })]),
                'additional directories allowed': _pa.cc($['additional directories allowed'], ($) => ['text', ({
                    'delimiter': ['backtick', null],
                    'value': $p['value serializers']['boolean'](
                        $,
                        null
                    ),
                })]),
                'extensions': _pa.cc($['extensions'], ($) => ['list', $.map(($) => ['text', ({
                    'delimiter': ['quote', null],
                    'value': $,
                })])]),
                'warn': _pa.cc($['warn'], ($) => ['text', ({
                    'delimiter': ['backtick', null],
                    'value': $p['value serializers']['boolean'](
                        $,
                        null
                    ),
                })]),
            })],
        }))
        case 'freeform': return _pa.ss($, ($) => ({
            'state': "freeform",
            'value': ['nothing', null],
        }))
        case 'ignore': return _pa.ss($, ($) => ({
            'state': "ignore",
            'value': ['nothing', null],
        }))
        case 'generated': return _pa.ss($, ($) => ({
            'state': "generated",
            'value': ['verbose group', _pa.dictionary_literal({
                'commit to git': _pa.cc($['commit to git'], ($) => ['text', ({
                    'delimiter': ['backtick', null],
                    'value': $p['value serializers']['boolean'](
                        $,
                        null
                    ),
                })]),
            })],
        }))
        default: return _pa.au($[0])
    }
})]
