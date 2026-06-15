import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_di from 'pareto-core/dist/data/interface'
import * as p_ri from 'pareto-core/dist/refiner/interface'

//data types
import * as d from "astn-core/dist/interface/generated/liana/schemas/parse_tree/data"
import * as d_in from "pareto-fountain-pen/dist/interface/generated/liana/schemas/list_of_characters/data"
import * as d_out from "../../../../interface/to_be_generated/npm_package"
import * as d_function from "../../../../interface/to_be_generated/deserialize_package_json"
import * as d_parse_tree_from_x from "astn-core/dist/interface/to_be_generated/deserialize"


type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

type Object = p_di.Dictionary<d.Value>

//dependencies
import * as t_parse_tree_from_list_of_characters from "astn-core/dist/implementation/manual/refiners/parse_tree/list_of_characters"


const expect_object = ($: d.Value, abort: (error: Error_Expect_Object) => never): Object => {

    const expect_unique_identifiers_fixme = ($: d.ID_Value_Pairs, abort: (error: Error_Expect_Object) => never): Object => {
        const temp: { [id: string]: d.Value } = {}
        $.__l_map(($) => {
            if (temp[$.id.token.value] !== undefined) {
                abort(['duplicate identifier', $.id.token.value])
            } else {
                temp[$.id.token.value] = $.assignment.__decide(
                    ($) => $.value.__decide(
                        ($) => $,
                        () => abort(['missing value', null]),
                    ),
                    () => abort(['missing value', null]),
                )
            }
            return null
        })
        return pt.dictionary.literal(temp)
    }
    return pt.decide.state($.type, ($) => {
        switch ($[0]) {
            case 'concrete': return pt.ss($, ($) => pt.decide.state($, ($) => {
                switch ($[0]) {
                    case 'dictionary': return pt.ss($, ($) => expect_unique_identifiers_fixme($.entries, abort))
                    case 'group': return pt.ss($, ($) => pt.decide.state($, ($) => {
                        switch ($[0]) {
                            case 'verbose': return pt.ss($, ($) => expect_unique_identifiers_fixme($.properties, abort))
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

const expect_text = ($: d.Value, abort: (error: ['not a text', null]) => never): string => pt.decide.state($.type, ($) => {
    switch ($[0]) {
        case 'concrete': return pt.ss($, ($) => pt.decide.state($, ($) => {
            switch ($[0]) {
                case 'text': return pt.ss($, ($) => $.token.value)
                default: return abort(['not a text', null])
            }
        }))
        default: return abort(['not a text', null])
    }
})

const expect_property = ($: Object, id: string, abort: (error: ['missing property', string]) => never): d.Value => $.__get_entry_deprecated(
    id,
    {
        no_such_entry: () => abort(['missing property', id])
    }
)

export const $$: p_ri.Refiner<d_out.NPM_Package, d_function.Error['type'], d_in.List_of_Characters> = ($, abort) => {
    const x = t_parse_tree_from_list_of_characters.Document(
        $,
        ($) => abort(['invalid ASTN', $]),
        {
            'tab size': 4,
        },
    )

    const root = expect_object(x.content, (error) => abort(['missing root object', null]))
    const name = expect_text(expect_property(root, 'name', (error) => abort(['name', ['missing', null]])), (error) => abort(['name', ['not a text', null]]))

    const version = expect_text(expect_property(root, 'version', (error) => abort(['version', ['missing', null]])), (error) => abort(['version', ['not a text', null]]))

    return {
        'name': name,
        'version': version,
        'dependencies': pt.optional.from.optional(
            root.__get_possible_entry_deprecated('dependencies'),
        ).map(
            ($) => expect_object(
                $,
                (error) => abort(['dependencies', ['not an object', null]])
            ).__d_map(
                ($, id) => expect_text(
                    $,
                    (error) => abort(['dependencies', ['not a text', id]])
                )
            )
        )
    }
}