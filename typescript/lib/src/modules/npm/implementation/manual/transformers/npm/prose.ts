import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../../interface/data/npm_tool.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

export namespace interface_ {

    export type Error = p_i.Transformer<
        d_in.Error,
        d_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"


export const Error: interface_.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error while running npm': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error while running npm: "),
                t_epe_to_prose.Error($)
            ]))
            default: return p_.exhaustive($[0])
        }
    }
)