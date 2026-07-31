
import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/get_package_dependencies.js"
import type * as s_out from "../../../schemas/graphviz.js"
import type * as s_out_attributes from "../../../schemas/graphviz_attributes.js"

namespace declarations {
    export type Result = p_.Transformer<
        s_in.Result,
        s_out.Graph
    >
}

//schemas

export const Result: declarations.Result = ($) => {
    const $v_packages = $.packages
    return {
        'attributes': p_.literal.list<s_out_attributes.Attributes.L>([
            ['rankdir', ['LR', null]],
        ]),
        'nodes': p_.from.dictionary($.packages).map(
            ($) => ({
                'attributes': p_.literal.list<s_out_attributes.Attributes.L>([]),
            })),
        'edges': p_.from.dictionary($.packages).flatten_to_list(
            ($, id) => {
                const from = id
                return p_.from.optional($.dependencies).decide(
                    ($) => p_.from.dictionary(
                        p_.from.dictionary($).map_optionally(
                            ($, id) => {
                                if (id === "pareto-core"
                                    || id === "pareto-core-shorthands"
                                ) {
                                    return p_.literal.not_set<s_out.Graph.edges.L>()
                                }
                                return p_.literal.set({
                                    'from': from,
                                    'to': id,
                                    'attributes': p_.from.dictionary($v_packages).get_possible_entry(
                                        id,
                                        ($) => p_.literal.list([]),
                                        () => p_.literal.list<s_out_attributes.Attributes.L>([
                                            ['color', "red"]
                                        ])
                                    ),
                                })
                            }
                        ),
                    ).convert_to_list(
                        ($) => $,
                    ),
                    () => p_.literal.list([])
                )
            }
        ),

    }
}