import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../../interface/data/build_and_test.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_build_to_prose from "../build/prose.js"
import * as t_epe_to_prose from "pareto-resources/implementation/manual/transformers/execute_command_executable/prose"

export namespace interface_ {

    export type Error = p_i.Transformer_With_Parameter<
        d_in.Error,
        d_out.Phrase,
        {
            'concise': boolean
        }
    >
}
import * as temp_interface_ from "../../../../interface/declarations/transformers/build_and_test/prose.js"

export const Error: interface_.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'error building': return p_.option($, ($) => t_build_to_prose.Error($, $p))
            case 'error testing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("error while testing:"),
                t_epe_to_prose.Error($),
            ]))
            default: return p_.exhaustive($[0])
        }
    })