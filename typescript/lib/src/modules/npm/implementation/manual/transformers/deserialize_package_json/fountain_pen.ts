import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_ti from 'pareto-core/dist/transformer/interface'

import * as d_in from "../../../../interface/to_be_generated/deserialize_package_json"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

export namespace signatures {
    export type Error = p_ti.Transformer<d_in.Error, d_out.Phrase>
}

//dependencies
import * as t_deserialize_parse_tree_to_fp from "astn-core/dist/implementation/manual/transformers/deserialize_parse_tree/fountain_pen"
import * as t_deserialize_parse_tree_to_location from "astn-core/dist/implementation/manual/transformers/deserialize_parse_tree/location"
import * as t_location_to_fp from "astn-core/dist/implementation/manual/transformers/location/fountain_pen"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const Error: signatures.Error = ($) => sh.ph.composed([
    sh.ph.literal(t_path_to_text.Node_Path($['path'])),
    pt.decide.state($.type, ($) => {
        switch ($[0]) {
            case 'invalid ASTN': return pt.ss($, ($) => sh.ph.composed([
                sh.ph.literal(" :"),
                t_location_to_fp.Possible_Range(
                    t_deserialize_parse_tree_to_location.Error($),
                    {
                        'character location reporting': ['one based', null],
                    }
                ),
                sh.ph.literal(" : invalid JSON (or even ASTN): "),
                t_deserialize_parse_tree_to_fp.Error($),
            ]))
            case 'missing root object': return pt.ss($, ($) => sh.ph.literal(" : missing root object in package.json"))
            case 'name': return pt.ss($, ($) => sh.ph.literal(" : missing or invalid 'name' property in package.json"))
            case 'version': return pt.ss($, ($) => sh.ph.literal(" : missing or invalid 'version' property in package.json"))
            case 'dependencies': return pt.ss($, ($) => sh.ph.literal(" : missing or invalid 'dependencies' property in package.json"))
            default: return pt.au($[0])
        }
    })
])