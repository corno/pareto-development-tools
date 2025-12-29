import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../interface/to_be_generated/set_up_comparison_against_published"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/execute_procedure_executable/fountain_pen"
import * as t_make_directory_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/make_directory/fountain_pen"
import * as t_read_file_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/read_file/fountain_pen"
import * as t_remove_to_fountain_pen from "exupery-resources/dist/implementation/transformers/schemas/remove/fountain_pen"


export const Error: Error = ($) => {
    return _pt.cc($, ($): d_out.Block_Part => {
        switch ($[0]) {
            case 'error while running npm command': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running npm command: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_epe_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while running npm query': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running npm query: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_epe_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while running tar': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while running tar: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_epe_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while creating directory': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while creating directory: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_make_directory_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while removing directory': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while removing directory: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_remove_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while reading package.json': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while reading package.json: `),
                sh.b.indent([
                    sh.g.nested_block([
                        t_read_file_to_fountain_pen.Error($)
                    ])
                ]),
            ]))
            case 'error while parsing package.json': return _pt.ss($, ($) => sh.b.sub([
                sh.b.snippet(`error while parsing package.json: `),
                sh.b.indent([
                    sh.g.nested_block([
                        sh.b.snippet($)
                    ])
                ]),
            ]))
            default: return _pt.au($[0])
        }
    })
}