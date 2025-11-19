import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../interface/commands/clean_and_update_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_out.Block_Part, d_in.Error>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

import * as t_u2l_to_fountain_pen from "../../../modules/npm/implementation/transformers/update2latest/fountain_pen"
import * as t_git_clean_to_fountain_pen from "../../../modules/git/implementation/transformers/clean/fountain_pen"
import * as t_npm_to_fountain_pen from "../../../modules/npm/implementation/transformers/npm/fountain_pen"

export const Error: Error = ($) => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'could not clean': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not clean typescript dependencies: `),
                t_git_clean_to_fountain_pen.Error($)
            ]))
            case 'could not update to latest': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not update to latest typescript dependencies: `),
                t_u2l_to_fountain_pen.Error($)
            ]))
            case 'could not install': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`could not install typescript dependencies: `),
                t_npm_to_fountain_pen.Error($)
            ]))
            default: return _ea.au($[0])
        }
    })
}