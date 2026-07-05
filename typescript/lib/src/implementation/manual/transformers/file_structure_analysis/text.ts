import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_i from 'pareto-core/dist/interface/transformer'
import p_text_from_list from 'pareto-core/dist/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/dist/implementation/refiner/specials/list_from_text'

//data types
import * as d_in from "../../../../interface/data/file_structure_analysis"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/text/data"

export namespace interface_ {
    export type Path = p_i.Transformer<
        d_in.Path,
        d_out.Text
    >
}


export const Path: interface_.Path = ($) => p_text_from_list(
    p_.from.list($).flatten(
        ($) => p_.literal.segmented_list([
            p_.literal.list([
                0x2F, // /
            ]),
            p_list_from_text(
                $,
                ($) => $
            )
        ])
    ),
    ($) => $,
)