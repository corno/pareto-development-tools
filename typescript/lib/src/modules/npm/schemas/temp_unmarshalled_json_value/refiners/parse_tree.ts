import * as p_ from 'pareto-core/refiner'
import * as p_t from 'pareto-core/transformer'
import type * as p_di from 'pareto-core/schema'
import type * as p_ri from 'pareto-core/refiner'
import p_change_context from 'pareto-core/refiner/specials/change_context'

//schemas
import type * as s_in from "astn-core/modules/deserialization/schemas/parse_tree/schema"
import type * as s_out from "../schema.js"
import type * as s_error from "../../deserialize_package_json/schema.js"

//dependencies

export const Object_temp: p_ri.Refiner<
    s_out.Object_,
    s_out.Error_Expect_Object,
    s_in.ID_Value_Pairs
> = ($, abort) => {
    const dict = p_.from.list($).convert_to_dictionary(
        ($) => $.id.token.value,
        ($) => $.assignment,
        {
            'duplicate_id': (id) => abort(['duplicate identifier', id]),
        }
    )
    return p_t.from.dictionary(dict).map(
        ($) => p_.from.optional($).decide(
            ($) => p_.from.optional($.value).decide(
                ($) => $,
                () => abort(['missing value', null])

            ),
            () => abort(['missing value', null])
        )
    )

}


export const Object_: p_ri.Refiner<
    s_out.Object_,
    s_out.Error_Expect_Object,
    s_in.Value
> = ($, abort) => p_.from.state($.type).decide(
    ($) => {
        switch ($[0]) {
            case 'concrete': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'dictionary': return p_.option($, ($) => Object_temp($.entries, abort))
                        case 'group': return p_.option($, ($) => p_.from.state($).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'verbose': return p_.option($, ($) => Object_temp($.properties, abort))
                                    default: return abort(['not an object', null])
                                }
                            }))
                        default: return abort(['not an object', null])
                    }
                }
            ))
            default: return abort(['not an object', null])
        }
    }
)

export const Text: p_ri.Refiner<
    string,
    ['not a text', null],
    s_in.Value
> = ($, abort) => p_.from.state($.type).decide(
    ($) => {
        switch ($[0]) {
            case 'concrete': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'text': return p_.option($, ($) => $.token.value)
                        default: return abort(['not a text', null])
                    }
                }))
            default: return abort(['not a text', null])
        }
    })

export const Property: p_ri.Refiner_With_Parameter<
    s_in.Value,
    ['missing property', string],
    s_out.Object_,
    {
        'id': string
    }
> = ($, abort, $p): s_in.Value => p_.from.dictionary($).get_entry(
    $p.id,
    {
        no_such_entry: () => abort(['missing property', $p.id])
    }
)