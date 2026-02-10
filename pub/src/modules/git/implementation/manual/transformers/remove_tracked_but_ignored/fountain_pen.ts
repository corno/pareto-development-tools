import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'

import * as d_in from "../../../../interface/to_be_generated/remove_tracked_but_ignored"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"

import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export type Error = _pi.Transformer<d_in.Error, d_out.Phrase>

import * as t_git_is_clean_to_fountain_pen from "../is_repository_clean/fountain_pen"
import * as t_ece_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/execute_command_executable/transformers/fountain_pen"

export const Error: Error = ($) => _p.decide.state($, ($): d_out.Phrase => {
    switch ($[0]) {
        case 'not clean': return _p.ss($, ($) => sh.ph.literal("the working directory is not clean. Aborting removal of tracked but ignored files."))
        case 'unexpected error': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("unexpected error while checking if git is clean: "),
            t_git_is_clean_to_fountain_pen.Error($)
        ]))
        case 'could not remove': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not remove tracked but ignored files: "),
            t_ece_to_fountain_pen.Error($)
        ]))
        case 'could not add': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not add tracked but ignored files: "),
            t_ece_to_fountain_pen.Error($)
        ]))
        case 'could not clean': return _p.ss($, ($) => sh.ph.composed([
            sh.ph.literal("could not clean tracked but ignored files: "),
            t_ece_to_fountain_pen.Error($)
        ]))
        default: return _p.au($[0])
    }
})