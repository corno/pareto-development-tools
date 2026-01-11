
import * as _pi from 'pareto-core-interface'
import * as _p from 'pareto-core-transformer'

import * as d_in from "../../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-graphviz/dist/interface/generated/pareto/schemas/graphviz/data_types/target"

export type Result = _pi.Transformer<d_in.Result, d_out.Graph>

export const Result: Result = ($) => {
    return {
        'nodes': $.packages.map(($) => null),
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
                                        || key === "pareto-core-shorthands"
                                        || key === "pareto-core-data"
                                        || key === "pareto-core-command"
                                        || key === "pareto-core-query"
                                        || key === "pareto-host-nodejs"
                                    ) {
                                        return _p.optional.not_set<d_out.Graph.edges.L>()
                                    }
                                    return _p.optional.set(({
                                        'from': from,
                                        'to': key,
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