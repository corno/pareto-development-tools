import * as _p from 'pareto-core/dist/refiner'
import * as _pi from 'pareto-core/dist/interface'

//data types
import * as d from "astn-core/dist/interface/generated/pareto/schemas/parse_tree/data"
import * as d_npm_package from "../../../../../interface/to_be_generated/npm_package"
import * as d_deseralize_package_json from "../../../../../interface/to_be_generated/deserialize_package_json"


type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

type Object = _pi.Dictionary<d.Value>

//dependencies
import * as ds_astn_source from "astn-core/dist/implementation/manual/schemas/parse_tree/deserializers"


const expect_object = ($: d.Value, abort: (error: Error_Expect_Object) => never): Object => {

    const expect_unique_identifiers = ($: d.Key_Value_Pairs, abort: (error: Error_Expect_Object) => never): Object => {
        const temp: { [key: string]: d.Value } = {}
        $.__for_each(($) => {
            if (temp[$.key.value] !== undefined) {
                abort(['duplicate identifier', $.key.value])
            } else {
                temp[$.key.value] = $.value.__decide(
                    ($) => $.value,
                    () => abort(['missing value', null]),
                )
            }
        })
        return _p.dictionary.literal(temp)
    }
    return _p.sg($.type, ($) => {
        switch ($[0]) {
            case 'concrete': return _p.ss($, ($) => _p.sg($, ($) => {
                switch ($[0]) {
                    case 'dictionary': return _p.ss($, ($) => expect_unique_identifiers($.entries, abort))
                    case 'group': return _p.ss($, ($) => _p.sg($, ($) => {
                        switch ($[0]) {
                            case 'verbose': return _p.ss($, ($) => expect_unique_identifiers($.entries, abort))
                            default: return abort(['not an object', null])
                        }
                    }))
                    default: return abort(['not an object', null])
                }
            }))
            default: return abort(['not an object', null])
        }
    })
}

const expect_text = ($: d.Value, abort: (error: ['not a text', null]) => never): string => _p.sg($.type, ($) => {
    switch ($[0]) {
        case 'concrete': return _p.ss($, ($) => _p.sg($, ($) => {
            switch ($[0]) {
                case 'text': return _p.ss($, ($) => $.value)
                default: return abort(['not a text', null])
            }
        }))
        default: return abort(['not a text', null])
    }
})

const expect_property = ($: Object, key: string, abort: (error: ['missing property', string]) => never): d.Value => $.__get_entry(key, () => abort(['missing property', key]))

export const $$: _pi.Deserializer_With_Parameters<d_npm_package.NPM_Package, d_deseralize_package_json.Error, { 'uri': string }> = ($, abort, $p) => {
    const x = ds_astn_source.Document(
        $,
        () => abort(['invalid ASTN', null]),
        {
            'tab size': 4,
            'uri': $p.uri
        },
    )

    const root = expect_object(x.content, (error) => abort(['missing root object', null]))
    const name = expect_text(expect_property(root, 'name', (error) => abort(['name', ['missing', null]])), (error) => abort(['name', ['not a text', null]]))

    const version = expect_text(expect_property(root, 'version', (error) => abort(['version', ['missing', null]])), (error) => abort(['version', ['not a text', null]]))

    return {
        'name': name,
        'version': version,
        'dependencies': root.__get_possible_entry('dependencies').__o_map(
            ($) => expect_object(
                $,
                (error) => abort(['dependencies', ['not an object', null]])
            ).__d_map(
                ($, key) => expect_text(
                    $,
                    (error) => abort(['dependencies', ['not a text', key]])
                )
            )
        )
    }
}