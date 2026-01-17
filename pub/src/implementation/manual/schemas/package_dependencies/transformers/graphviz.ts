
import * as _pi from 'pareto-core-interface'
import * as _p from 'pareto-core-transformer'

import * as d_in from "../../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/pareto/schemas/graphviz/data"

export type Result = _pi.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    const pacakges = $.packages
    return {
        'nodes': $.packages.__d_map(($) => null),
        'edges': _p.list.flatten(
            _p.list.from_dictionary(
                $.packages,
                ($, key) => {
                    const from = key
                    return $.dependencies.__decide(
                        ($) => _p.list.from_dictionary(
                            _p.dictionary.filter(
                                $,
                                ($, key) => {
                                    if (key === "pareto-core-interface"
                                        || key === "pareto-core-transformer"
                                        || key === "pareto-core-refiner"
                                        || key === "pareto-core-serializer"
                                        || key === "pareto-core-deserializer"
                                        || key === "pareto-core-command"
                                        || key === "pareto-core-query"

                                        || key === "pareto-core-shorthands"
                                        //|| key === "pareto-host-nodejs"
                                    ) {
                                        return _p.optional.not_set<d_out.Graph.edges.L>()
                                    }
                                    return _p.optional.set(({
                                        'from': from,
                                        'to': key,
                                        // 'attributes': pacakges.__get_possible_entry(key).__decide(
                                        //     ($) => _p.list.literal([]),
                                        //     () => _p.list.literal([
                                        //         {
                                        //             'key': 'color',
                                        //             'value': 'red',
                                        //         }
                                        //     ])
                                        // ),
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