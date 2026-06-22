
import * as p_i from 'pareto-core/dist/interface/transformer'
import * as p_ from 'pareto-core/dist/implementation/transformer'

import * as d_in from "../../../../interface/data/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/liana/schemas/high_level_simple/data"
import * as d_out_attributes from "pareto-graphviz/dist/interface/generated/liana/schemas/attributes/data"

export type Result = p_i.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    const $v_packages = $.packages
    return {
        'attributes': p_.literal.list<d_out_attributes.Attributes.L>([
            ['rankdir', ['LR', null]],
        ]),
        'nodes': p_.from.dictionary($.packages).map(($) => ({
            'attributes': p_.literal.list<d_out_attributes.Attributes.L>([]),
        })),
        'edges': p_.from.dictionary(
            $.packages
        ).flatten_to_list(
            ($, id) => {
                const from = id
                return p_.from.optional($.dependencies).decide(
                    ($) => p_.from.dictionary(
                        p_.from.dictionary(
                            $,
                        ).map_optionally(
                            ($, id) => {
                                if (id === "pareto-core"
                                    || id === "pareto-core-shorthands"
                                    //|| id === "pareto-host-nodejs"
                                ) {
                                    return p_.literal.not_set<d_out.Graph.edges.L>()
                                }
                                return p_.literal.set(({
                                    'from': from,
                                    'to': id,
                                    'attributes': p_.from.dictionary($v_packages).get_possible_entry(
                                        id,
                                        ($) => p_.literal.list([]),
                                        () => p_.literal.list<d_out_attributes.Attributes.L>([
                                            ['color', "red"]
                                        ])
                                    ),
                                }))
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