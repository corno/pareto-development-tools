import * as p_ from 'pareto-core/dist/implementation/refiner'
import * as p_temp from 'pareto-core/dist/implementation/transformer'
import * as p_di from 'pareto-core/dist/interface/data'
import * as p_ri from 'pareto-core/dist/interface/refiner'

//data types
import * as d_in from "astn-core/dist/interface/generated/liana/schemas/parse_tree/data"
import * as d_out from "../../../../interface/data/npm_package"
import * as d_function from "../../../../interface/data/deserialize_package_json"


type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

type Object_ = p_di.Dictionary<d_in.Value>

const Object_: p_ri.Refiner<
    Object_,
    Error_Expect_Object,
    d_in.Value
> = ($, abort) => {

    const expect_unique_identifiers_fixme = ($: d_in.ID_Value_Pairs, abort: (error: Error_Expect_Object) => never): Object_ => {
        const temp: { [id: string]: d_in.Value } = {}
        p_.from.list($).map(($) => {
            if (temp[$.id.token.value] !== undefined) {
                abort(['duplicate identifier', $.id.token.value])
            } else {
                temp[$.id.token.value] = p_.from.optional($.assignment).decide(
                    ($) => p_.from.optional($.value).decide(
                        ($) => $,
                        () => abort(['missing value', null]),
                    ),
                    () => abort(['missing value', null]),
                )
            }
            return null
        })
        return p_.literal.dictionary(temp)
    }
    return p_.from.state($.type).decide(($) => {
        switch ($[0]) {
            case 'concrete': return p_.ss($, ($) => p_.from.state($).decide(($) => {
                switch ($[0]) {
                    case 'dictionary': return p_.ss($, ($) => expect_unique_identifiers_fixme($.entries, abort))
                    case 'group': return p_.ss($, ($) => p_.from.state($).decide(($) => {
                        switch ($[0]) {
                            case 'verbose': return p_.ss($, ($) => expect_unique_identifiers_fixme($.properties, abort))
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

const Text: p_ri.Refiner<
    string,
    ['not a text', null],
    d_in.Value
> = ($, abort) => p_.from.state($.type).decide(($) => {
    switch ($[0]) {
        case 'concrete': return p_.ss($, ($) => p_.from.state($).decide(($) => {
            switch ($[0]) {
                case 'text': return p_.ss($, ($) => $.token.value)
                default: return abort(['not a text', null])
            }
        }))
        default: return abort(['not a text', null])
    }
})

const Property: p_ri.Refiner_With_Parameter<
    d_in.Value,
    ['missing property', string],
    Object_,
    {
        'id': string
    }
> = ($, abort, $p): d_in.Value => p_.from.dictionary($).get_entry(
    $p.id,
    {
        no_such_entry: () => abort(['missing property', $p.id])
    }
)

export const NPM_Package: p_ri.Refiner<
    d_out.NPM_Package,
    d_function.Error['type'],
    d_in.Document
> = ($, abort) => {
    

    const root = Object_(
        $.content,
        ($) => abort(['missing root object', null])
    )
    const name = Text(
        Property(
            root,
            ($) => abort(['name', ['missing', null]]),
            {
                'id': "name",
            }
        ),
        (error) => abort(['name', ['not a text', null]])
    )

    const version = Text(
        Property(
            root,
            ($) => abort(['version', ['missing', null]]),
            {
                'id': "version",
            }
        ),
        (error) => abort(['version', ['not a text', null]])
    )

    return {
        'name': name,
        'version': version,
        'dependencies': p_.from.optional(
            p_temp.from.dictionary(root).get_possible_entry("dependencies"),
        ).map(
            ($) => Object_(
                $,
                ($) => abort(['dependencies', ['not an object', null]])
            ).__d_map_deprecated(
                ($, id) => Text(
                    $,
                    ($) => abort(['dependencies', ['not a text', id]])
                )
            )
        )
    }
}