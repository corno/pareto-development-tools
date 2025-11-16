import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "../../../../../interface/temp/procedures/commands/git_remove_tracked_but_ignored"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as t_git_is_clean_to_fountain_pen from "../../queries/git_is_clean/fountain_pen"
import * as t_eqe_to_fountain_pen from "../../temp_exupery_resources/execute_query_executable/fountain_pen"

export const Error: Error = ($) => _ea.cc($, ($): d_out.Block_Part => {
    switch ($[0]) {
        case 'not clean': return _ea.ss($, ($) => sh.b.snippet(`the working directory is not clean. Aborting removal of tracked but ignored files.`))
        case 'unexpected error': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`unexpected error while checking if git is clean: `),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        case 'could not remove': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not remove tracked but ignored files: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        case 'could not add': return _ea.ss($, ($) => sh.b.sub([
            sh.b.snippet(`could not add tracked but ignored files: `),
            t_eqe_to_fountain_pen.Error($)
        ]))
        default: return _ea.au($[0])
    }
})