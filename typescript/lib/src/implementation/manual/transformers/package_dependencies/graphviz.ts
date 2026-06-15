
import * as p_i from 'pareto-core/dist/interface/transformer'
import * as pt from 'pareto-core/dist/implementation/transformer'

import * as d_in from "../../../../interface/data/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/liana/schemas/high_level_simple/data"
import * as d_out_attributes from "pareto-graphviz/dist/interface/generated/liana/schemas/attributes/data"

export type Result = p_i.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    const pacakges = $.packages
    return {
        'attributes': pt.literal.list<d_out_attributes.Attributes.L>([
            ['rankdir', ['LR', null]],
        ]),
        'nodes': $.packages.__d_map(($) => ({
            'attributes': pt.literal.list<d_out_attributes.Attributes.L>([]),
        })),
        'edges': pt.list.from.dictionary(
            $.packages
        ).flatten(
            ($, id) => {
                const from = id
                return $.dependencies.__decide(
                    ($) => pt.list.from.dictionary(
                        pt.dictionary.from.dictionary(
                            $,
                        ).map_optionally(
                            ($, id) => {
                                if (id === "pareto-core"
                                    || id === "pareto-core-shorthands"
                                    //|| id === "pareto-host-nodejs"
                                ) {
                                    return pt.literal.not_set<d_out.Graph.edges.L>()
                                }
                                return pt.literal.set(({
                                    'from': from,
                                    'to': id,
                                    'attributes': pacakges.__get_possible_entry_deprecated(id).__decide(
                                        ($) => pt.literal.list([]),
                                        () => pt.literal.list<d_out_attributes.Attributes.L>([
                                            ['color', "red"]
                                        ])
                                    ),
                                }))
                            }
                        ),
                    ).convert(
                        ($) => $,
                    ),
                    () => pt.literal.list([])
                )
            }
        ),

    }
}