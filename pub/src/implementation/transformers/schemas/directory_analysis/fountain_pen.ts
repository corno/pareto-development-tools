import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../interface/to_be_generated/analyze_file_structure"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_package_dependencies_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/directory_content/fountain_pen"
import * as t_read_directory_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/read_directory/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'log': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`log: `),
            sh.b.indent([
                sh.g.nested_block([
                    // t_tsc_to_fountain_pen.Error($)
                ])
            ])
        ]))
        case 'directory content processing': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`directory content processing: `),
            sh.b.indent([
                sh.g.sub($.deprecated_to_array(() => 0).map(($) => sh.g.nested_block([
                    sh.b.snippet(`${$.key}: `),
                    _ea.cc($.value, ($) => {
                        switch ($[0]) {
                            case 'not a directory': return _ea.ss($, ($) =>sh.b.snippet(`not a directory`))
                            case 'directory content': return _ea.ss($, ($) => t_package_dependencies_to_fountain_pen.Error($))
                            default: return _ea.au($[0])
                        }
                    })

                ])))
            ])
        ]))
        case 'read directory': return _ea.ss($, ($) => sh.b.sub([
            t_read_directory_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})