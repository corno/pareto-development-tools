import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in from "../../../schemas/build_and_validate.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer_With_Parameter<
        s_in.Error,
        s_out.Phrase,
        {
            'concise': boolean
        }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_build_to_paragraph from "../build/paragraph.js"
import * as t_ece_to_paragraph from "pareto-resources/implementation/transformers/execute_unrestricted_command_executable/paragraph"
import * as t_file_structure_validation_to_paragraph from "../../../submodules/file_structure_analysis/implementation/transformers/file_structure_validation/paragraph.js"

export const Error: declarations.Error = ($, $p) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'building': return p_.option($, ($) => t_build_to_paragraph.Error($, $p))
            case 'testing': return p_.option($, ($) => sh.ph.composed([
                sh.ph.text("error while testing:"),
                t_ece_to_paragraph.Error($),
            ]))
            case 'file structure validation': return p_.option($, ($) => t_file_structure_validation_to_paragraph.Error($, $p))
            default: return p_.exhaustive($[0])
        }
    })