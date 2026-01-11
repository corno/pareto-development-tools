    import * as _p from 'pareto-core-transformer'
    import * as _pdev from 'pareto-core-dev'
    
    import * as _i_signatures from "../../../../../interface/generated/pareto/schemas/structure/marshall"
    import * as _i_out from "../../../../../interface/generated/pareto/core/astn_target"
    
    
    export const Directory: _i_signatures._T_Directory = ($, $p) => ['state', _p.deprecated_cc($, ($): _i_out._T_Value.SG.state => {
        switch ($[0]) {
            case 'dictionary': return _p.ss($, ($) => ({
                'state': "dictionary",
                'value': Directory(
                    $,
                    {
                        'value serializers': $p['value serializers'],
                    }
                ),
            }))
            case 'group': return _p.ss($, ($) => ({
                'state': "group",
                'value': ['dictionary', $.__d_map(($) => ['state', _p.deprecated_cc($, ($): _i_out._T_Value.SG.state => {
                    switch ($[0]) {
                        case 'directory': return _p.ss($, ($) => ({
                            'state': "directory",
                            'value': Directory(
                                $,
                                {
                                    'value serializers': $p['value serializers'],
                                }
                            ),
                        }))
                        case 'file': return _p.ss($, ($) => ({
                            'state': "file",
                            'value': ['state', _p.deprecated_cc($, ($): _i_out._T_Value.SG.state => {
                                switch ($[0]) {
                                    case 'manual': return _p.ss($, ($) => ({
                                        'state': "manual",
                                        'value': ['nothing', null],
                                    }))
                                    case 'generated': return _p.ss($, ($) => ({
                                        'state': "generated",
                                        'value': ['verbose group', _p.dictionary.literal({
                                            'commit to git': _p.deprecated_cc($['commit to git'], ($) => ['text', ({
                                                'delimiter': ['backtick', null],
                                                'value': $p['value serializers']['boolean'](
                                                    $,
                                                    null
                                                ),
                                            })]),
                                        })],
                                    }))
                                    default: return _p.au($[0])
                                }
                            })],
                        }))
                        default: return _p.au($[0])
                    }
                })])],
            }))
            case 'wildcards': return _p.ss($, ($) => ({
                'state': "wildcards",
                'value': ['verbose group', _p.dictionary.literal({
                    'required directories': _p.deprecated_cc($['required directories'], ($) => ['text', ({
                        'delimiter': ['backtick', null],
                        'value': $p['value serializers']['default number'](
                            $,
                            null
                        ),
                    })]),
                    'additional directories allowed': _p.deprecated_cc($['additional directories allowed'], ($) => ['text', ({
                        'delimiter': ['backtick', null],
                        'value': $p['value serializers']['boolean'](
                            $,
                            null
                        ),
                    })]),
                    'extensions': _p.deprecated_cc($['extensions'], ($) => ['list', $.__l_map(($) => ['text', ({
                        'delimiter': ['quote', null],
                        'value': $,
                    })])]),
                    'warn': _p.deprecated_cc($['warn'], ($) => ['text', ({
                        'delimiter': ['backtick', null],
                        'value': $p['value serializers']['boolean'](
                            $,
                            null
                        ),
                    })]),
                })],
            }))
            case 'freeform': return _p.ss($, ($) => ({
                'state': "freeform",
                'value': ['nothing', null],
            }))
            case 'ignore': return _p.ss($, ($) => ({
                'state': "ignore",
                'value': ['nothing', null],
            }))
            case 'generated': return _p.ss($, ($) => ({
                'state': "generated",
                'value': ['verbose group', _p.dictionary.literal({
                    'commit to git': _p.deprecated_cc($['commit to git'], ($) => ['text', ({
                        'delimiter': ['backtick', null],
                        'value': $p['value serializers']['boolean'](
                            $,
                            null
                        ),
                    })]),
                })],
            }))
            default: return _p.au($[0])
        }
    })]
