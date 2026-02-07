import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../../interface/to_be_generated/set_up_comparison_against_published"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_epe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"
import * as t_eqe_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_query_executable/transformers/fountain_pen"
import * as t_make_directory_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/make_directory/transformers/fountain_pen"
import * as t_read_file_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_file/transformers/fountain_pen"
import * as t_remove_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/remove/transformers/fountain_pen"
import * as t_get_package_json_to_fountain_pen from "../../get_package_json/transformers/fountain_pen"


export const Error: Error = ($) => {
    return _p.decide.state($, ($): d_out.Phrase => {
        switch ($[0]) {
            case 'error while running npm command': return _p.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while running npm command: "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        t_epe_to_fountain_pen.Error($)
                    ])
                ])),
            ]))
            case 'error while running npm query': return _p.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while running npm query: "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        t_eqe_to_fountain_pen.Error($)
                    ])
                ])),
            ]))
            case 'error while running tar': return _p.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while running tar: "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        t_epe_to_fountain_pen.Error($)
                    ])
                ])),
            ]))
            case 'error while creating directory': return _p.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while creating directory: "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        t_make_directory_to_fountain_pen.Error($)
                    ])
                ])),
            ]))
            case 'error while removing directory': return _p.ss($, ($) => sh.ph.composed([
                sh.ph.literal("error while removing directory: "),
                sh.ph.indent(sh.pg.sentences([
                    sh.sentence([
                        t_remove_to_fountain_pen.Error($)
                    ])
                ])),
            ]))
            case 'error while getting package.json': return _p.ss($, ($) => t_get_package_json_to_fountain_pen.Error($))
            default: return _p.au($[0])
        }
    })
}