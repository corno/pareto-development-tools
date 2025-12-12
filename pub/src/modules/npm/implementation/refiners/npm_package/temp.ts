import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "../../../interface/generated/pareto/core/astn_source"

export type NPM_Package = {
    'name': string
    'version': string
}

export type NPM_Package_Parse_Error =
    | ['invalid ASTN', null]
    | ['missing root object', null]
    | ['missing package name', null]
    | ['package name not a text', null]
    | ['missing version', null]
    | ['version not a text', null]


import * as r_parse from "../../generated/pareto/generic/parse/parse"

type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

type Object = _et.Dictionary<d._T_Value>

const expect_object = ($: d._T_Value, abort: (error: Error_Expect_Object) => never): Object => {

    const expect_unique_identifiers = ($: d._T_Key_Value_Pairs, abort: (error: Error_Expect_Object) => never): Object => {
        const temp: { [key: string]: d._T_Value } = {}
        $.__for_each(($) => {
            if (temp[$.key.value] !== undefined) {
                abort(['duplicate identifier', $.key.value])
            } else {
                temp[$.key.value] = $.value.transform(
                    ($) => $.value,
                    () => abort(['missing value', null]),
                )
            }
        })
        return _ea.dictionary_literal(temp)
    }
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'indexed collection': return _ea.ss($, ($) => _ea.cc($, ($) => {
                switch ($[0]) {
                    case 'dictionary': return _ea.ss($, ($) => expect_unique_identifiers($.entries, abort))
                    case 'verbose group': return _ea.ss($, ($) => expect_unique_identifiers($.entries, abort))
                    default: return _ea.au($[0])
                }
            }))
            default: return abort(['not an object', null])
        }
    })
}

const expect_text = ($: d._T_Value, abort: (error: ['not a text', null]) => never): string => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'string': return _ea.ss($, ($) => $.value)
            default: return abort(['not a text', null])
        }
    })
}

const expect_property = ($: Object, key: string, abort: (error: ['missing property', string]) => never): d._T_Value => {
    return $.__get_entry(key).transform(
        ($) => $,
        () => abort(['missing property', key]),
    )
}

export const $$ = ($: string, abort: (error: NPM_Package_Parse_Error) => never): NPM_Package => {
    return r_parse.parse(
        $,
        {
            'tab size': 4,
        }
    ).transform(
        ($) => {
            const root = expect_object($.content, (error) => abort(['missing root object', null]))
            const name = expect_text(expect_property(root, 'name', (error) => abort(['missing package name', null])), (error) => abort(['package name not a text', null]))

            const version = expect_text(expect_property(root, 'version', (error) => abort(['missing version', null])), (error) => abort(['version not a text', null]))

            return {
                'name': name,
                'version': version,
            }
        },
        (error) => {
            abort(['invalid ASTN', null])
        }
    )
}