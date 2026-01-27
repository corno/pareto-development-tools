
import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/transformer'

import * as d_in from "../../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/liana/schemas/graphviz/data"

export type Result = _pi.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    const pacakges = $.packages
    return {
        'attributes': _p.list.literal<d_out.Attributes.L>([
            ['rankdir', ['LR', null]],
        ]),
        'nodes': $.packages.__d_map(($) => ({
            'attributes': _p.list.literal([]),
        })),
        'edges': _p.list.flatten(
            _p.list.from_dictionary(
                $.packages,
                ($, id) => {
                    const from = id
                    return $.dependencies.__decide(
                        ($) => _p.list.from_dictionary(
                            _p.dictionary.filter(
                                $,
                                ($, id) => {
                                    if (id === "pareto-core"
                                        || id === "pareto-core-shorthands"
                                        //|| id === "pareto-host-nodejs"
                                    ) {
                                        return _p.optional.not_set<d_out.Graph.edges.L>()
                                    }
                                    return _p.optional.set(({
                                        'from': from,
                                        'to': id,
                                        'attributes': pacakges.__get_possible_entry(id).__decide(
                                            ($) => _p.list.literal([]),
                                            () => _p.list.literal<d_out.Attributes.L>([
                                                ['color', "red"]
                                            ])
                                        ),
                                    }))
                                }
                            ),
                            ($) => $,
                        ),
                        () => _p.list.literal([])
                    )
                }),
            ($) => $),
    }
}