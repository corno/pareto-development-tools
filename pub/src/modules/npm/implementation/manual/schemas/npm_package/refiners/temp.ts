import * as _p from 'pareto-core-refiner'
import * as _pi from 'pareto-core-interface'

//data types
import * as d from "../../../../../interface/generated/pareto/core/astn_source"

export type NPM_Package = {
    'name': string
    'version': string
    'dependencies': _pi.Optional_Value<_pi.Dictionary<string>>
}

export type NPM_Package_Parse_Error =
    | ['invalid ASTN', null]
    | ['missing root object', null]
    | ['name',
        | ['missing', null]
        | ['not a text', null]
    ]
    | ['version',

        | ['missing', null]
        | ['not a text', null]
    ]
    | ['dependencies',
        | ['not an object', null]
        | ['not a text', string]
    ]

type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

type Object = _pi.Dictionary<d._T_Value>

//dependencies
import * as r_parse from "../../../../generated/pareto/generic/parse/parse"


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
        return _p.dictionary.literal(temp)
    }
    return _p.cc($, ($) => {
        switch ($[0]) {
            case 'indexed collection': return _p.ss($, ($) => _p.cc($, ($) => {
                switch ($[0]) {
                    case 'dictionary': return _p.ss($, ($) => expect_unique_identifiers($.entries, abort))
                    case 'verbose group': return _p.ss($, ($) => expect_unique_identifiers($.entries, abort))
                    default: return _p.au($[0])
                }
            }))
            default: return abort(['not an object', null])
        }
    })
}

const expect_text = ($: d._T_Value, abort: (error: ['not a text', null]) => never): string => _p.cc($, ($) => {
    switch ($[0]) {
        case 'string': return _p.ss($, ($) => $.value)
        default: return abort(['not a text', null])
    }
})

const expect_property = ($: Object, key: string, abort: (error: ['missing property', string]) => never): d._T_Value => $.get_entry(key, () => abort(['missing property', key]))

export const $$: _pi.Deserializer<NPM_Package, NPM_Package_Parse_Error> = ($, abort) => {
    const x = r_parse.parse(
        $,
        {
            'tab size': 4,
        },
        () => abort(['invalid ASTN', null])
    )

    const root = expect_object(x.content, (error) => abort(['missing root object', null]))
    const name = expect_text(expect_property(root, 'name', (error) => abort(['name', ['missing', null]])), (error) => abort(['name', ['not a text', null]]))

    const version = expect_text(expect_property(root, 'version', (error) => abort(['version', ['missing', null]])), (error) => abort(['version', ['not a text', null]]))

    return {
        'name': name,
        'version': version,
        'dependencies': root.get_possible_entry('dependencies').map(
            ($) => expect_object(
                $,
                (error) => abort(['dependencies', ['not an object', null]])
            ).map(
                ($, key) => expect_text(
                    $,
                    (error) => abort(['dependencies', ['not a text', key]])
                )
            )
        )
    }
}