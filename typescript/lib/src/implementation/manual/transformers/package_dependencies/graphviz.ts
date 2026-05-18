
import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/assign'

import * as d_in from "../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/liana/schemas/high_level_simple/data"
import * as d_out_attributes from "pareto-graphviz/dist/interface/generated/liana/schemas/attributes/data"

export type Result = _pi.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    const pacakges = $.packages
    return {
        'attributes': _p.list.literal<d_out_attributes.Attributes.L>([
            ['rankdir', ['LR', null]],
        ]),
        'nodes': $.packages.__d_map(($) => ({
            'attributes': _p.list.literal<d_out_attributes.Attributes.L>([]),
        })),
        'edges': _p.list.from.dictionary(
            $.packages
        ).flatten(
            ($, id) => {
                const from = id
                return $.dependencies.__decide(
                    ($) => _p.list.from.dictionary(
                        _p.dictionary.from.dictionary(
                            $,
                        ).map_optionally(
                            ($, id) => {
                                if (id === "pareto-core"
                                    || id === "pareto-core-shorthands"
                                    //|| id === "pareto-host-nodejs"
                                ) {
                                    return _p.optional.literal.not_set<d_out.Graph.edges.L>()
                                }
                                return _p.optional.literal.set(({
                                    'from': from,
                                    'to': id,
                                    'attributes': pacakges.__get_possible_entry_deprecated(id).__decide(
                                        ($) => _p.list.literal([]),
                                        () => _p.list.literal<d_out_attributes.Attributes.L>([
                                            ['color', "red"]
                                        ])
                                    ),
                                }))
                            }
                        ),
                    ).convert(
                        ($) => $,
                    ),
                    () => _p.list.literal([])
                )
            }
        ),

    }
}