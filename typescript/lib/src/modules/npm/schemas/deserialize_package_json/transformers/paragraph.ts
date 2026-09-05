import * as p_ from 'pareto-core/transformer'

import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//dependencies
import * as ser_parse_tree_deserialization from "astn-core/modules/deserialization/schemas/parse_tree_deserialization/serializers"
import * as t_deserialize_parse_tree_to_location from "astn-core/modules/deserialization/schemas/parse_tree_deserialization/transformers/location"
import * as ser_location from "astn-core/modules/deserialization/schemas/location/serializers"
import * as ser_path from "pareto-execute-unrestricted-api/schemas/fs_unrestricted_path/serializers"

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

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