import * as p_ from 'pareto-core/implementation/serializer'

import type * as s_in from "../../interface/schemas/deserialize_package_json.js"

namespace declarations {
    export type Error = p_.Phrase_Serializer<
        s_in.Error
    >
}

//dependencies
import * as t_deserialize_parse_tree_to_prose from "astn-core/_implementation/serializers/parse_tree_deserialization"
import * as t_deserialize_parse_tree_to_location from "astn-core/_implementation/transformers/parse_tree_deserialization/location"
import * as t_location_to_prose from "astn-core/_implementation/serializers/location"
import * as t_path_to_text from "pareto-resources/implementation/serializers/unrestricted_path"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose_simple/deprecated"

export const Error: declarations.Error = ($) => sh.ph.composed([
    t_path_to_text.Node_Path($['path']),
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