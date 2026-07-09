import * as p_ from 'pareto-core/implementation/refiner'
import * as p_t from 'pareto-core/implementation/transformer'
import type * as p_di from 'pareto-core/interface/data'
import type * as p_ri from 'pareto-core/interface/refiner'
import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

//data types
import type * as d_in from "astn-core/interface/generated/liana/schemas/parse_tree/data"
import type * as d_out from "../../../interface/data/npm_package.js"
import type * as d_function from "../../../interface/data/deserialize_package_json.js"


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
        p_.from.list($).map(
            ($) => {
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
    return p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'concrete': return p_.option($, ($) => p_.from.state($).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'dictionary': return p_.option($, ($) => expect_unique_identifiers_fixme($.entries, abort))
                            case 'group': return p_.option($, ($) => p_.from.state($).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'verbose': return p_.option($, ($) => expect_unique_identifiers_fixme($.properties, abort))
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

    return p_change_context(
        Object_(
            $.content,
            ($) => abort(['missing root object', null])
        ),
        ($) => {

            const $p_name = Text(
                Property(
                    $,
                    ($) => abort(['name', ['missing', null]]),
                    {
                        'id': "name",
                    }
                ),
                (error) => abort(['name', ['not a text', null]])
            )

            const $p_version = Text(
                Property(
                    $,
                    ($) => abort(['version', ['missing', null]]),
                    {
                        'id': "version",
                    }
                ),
                (error) => abort(['version', ['not a text', null]])
            )

            return {
                'name': $p_name,
                'version': $p_version,
                'dependencies': p_t.from.dictionary($).get_possible_entry(
                    "dependencies",
                    ($) => p_.literal.set(p_change_context(
                        Object_(
                            $,
                            ($) => abort(['dependencies', ['not an object', null]])
                        ),
                        ($) => p_.from.dictionary($).map(
                            ($, id) => Text(
                                $,
                                ($) => abort(['dependencies', ['not a text', id]])
                            )
                        )
                    )),
                    () => p_.literal.not_set()
                ),
            }
        }
    )

}