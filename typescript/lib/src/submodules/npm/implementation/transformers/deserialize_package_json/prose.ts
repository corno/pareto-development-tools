import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

import type * as d_in from "../../../interface/schemas/deserialize_package_json.js"
import type * as d_out from "pareto-fountain-pen/interface/data/prose"

export namespace interface_ {
    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >
}

//dependencies
import * as t_deserialize_parse_tree_to_prose from "astn-core/implementation/transformers/deserialize_parse_tree/prose"
import * as t_deserialize_parse_tree_to_location from "astn-core/implementation/transformers/deserialize_parse_tree/location"
import * as t_location_to_prose from "astn-core/implementation/transformers/location/prose"
import * as t_path_to_text from "pareto-resources/implementation/transformers/unrestricted_path/text"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const Error: interface_.Error = ($) => sh.ph.composed([
    sh.ph.literal(t_path_to_text.Node_Path($['path'])),
    p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'invalid ASTN': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.literal(" :"),
                    t_location_to_prose.Possible_Range(
                        t_deserialize_parse_tree_to_location.Error($),
                        {
                            'character location reporting': ['one based', null],
                        }
                    ),
                    sh.ph.literal(" : invalid JSON (or even ASTN): "),
                    t_deserialize_parse_tree_to_prose.Error($),
                ]))
                case 'missing root object': return p_.option($, ($) => sh.ph.literal(" : missing root object in package.json"))
                case 'name': return p_.option($, ($) => sh.ph.literal(" : missing or invalid 'name' property in package.json"))
                case 'version': return p_.option($, ($) => sh.ph.literal(" : missing or invalid 'version' property in package.json"))
                case 'dependencies': return p_.option($, ($) => sh.ph.literal(" : missing or invalid 'dependencies' property in package.json"))
                default: return p_.exhaustive($[0])
            }
        })
])