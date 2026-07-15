import * as p_ from 'pareto-core/implementation/transformer'

import type * as s_in from "../../../interface/schemas/deserialize_package_json.js"
import type * as s_out from "../../../interface/schemas/paragraph.js"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//dependencies
import * as ser_parse_tree_deserialization from "astn-core/_implementation/serializers/parse_tree_deserialization"
import * as t_deserialize_parse_tree_to_location from "astn-core/_implementation/transformers/parse_tree_deserialization/location"
import * as ser_location from "astn-core/_implementation/serializers/location"
import * as ser_path from "pareto-resources/implementation/serializers/unrestricted_path"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/paragraph/deprecated"

export const Error: declarations.Error = ($) => sh.ph.composed([
    sh.ph.text(ser_path.Node_Path($['path'])),
    p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'invalid ASTN': return p_.option($, ($) => sh.ph.composed([
                    sh.ph.text(" :"),
                    sh.ph.text(
                        ser_location.Possible_Range(
                            t_deserialize_parse_tree_to_location.Error($),
                            {
                                'character location reporting': ['one based', null],
                            }
                        )
                    ),
                    sh.ph.text(" : invalid JSON (or even ASTN): "),
                    sh.ph.text(ser_parse_tree_deserialization.Error($)),
                ]))
                case 'missing root object': return p_.option($, ($) => sh.ph.text(" : missing root object in package.json"))
                case 'name': return p_.option($, ($) => sh.ph.text(" : missing or invalid 'name' property in package.json"))
                case 'version': return p_.option($, ($) => sh.ph.text(" : missing or invalid 'version' property in package.json"))
                case 'dependencies': return p_.option($, ($) => sh.ph.text(" : missing or invalid 'dependencies' property in package.json"))
                default: return p_.exhaustive($[0])
            }
        })
])