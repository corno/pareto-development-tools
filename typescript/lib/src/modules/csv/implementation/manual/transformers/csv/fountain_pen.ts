import * as pt from 'pareto-core/dist/transformer/implementation'
import * as p_ti from 'pareto-core/dist/transformer/interface'
import p_list_from_text from 'pareto-core/dist/specials/list_from_text'

//data types
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/prose/data"
import * as d_in from "../../../../interface/to_be_generated/csv"


export type Signature = p_ti.Transformer_With_Parameter<
    d_in.CSV,
    d_out.Paragraph,
    {
        'separator': number
    }
>

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/prose"

export const CSV: Signature = ($, $p) => sh.pg.sentences(pt.list.from.list(
    $,
).map(
    ($) => sh.sentence([
        sh.ph.rich(
            pt.list.from.list(
                $,
            ).map(
                ($) => sh.ph.serialize(
                    pt.list.nested_literal_old([
                        [
                            0x22, //"
                        ],
                        pt.list.from.list(
                            p_list_from_text(
                                $,
                                ($) => $ === 0x22 //"
                                    ? pt.list.literal([0x22, 0x22]) //escape "
                                    : pt.list.literal([$]),
                            ),
                        ).flatten(
                            ($) => $
                        ),
                        [
                            0x22, //"
                        ]
                    ])
                )
            ),
            sh.ph.nothing(),
            sh.ph.nothing(),
            sh.ph.serialize(pt.list.literal([$p.separator])),
            sh.ph.nothing(),
        )
    ])
))

