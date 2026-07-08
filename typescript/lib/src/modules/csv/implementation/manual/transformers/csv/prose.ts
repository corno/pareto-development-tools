import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_i from 'pareto-core/interface/transformer'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

//data types
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/prose/data"
import type * as d_in from "../../../../interface/data/csv.js"

export namespace interface_ {

    export type CSV = p_i.Transformer_With_Parameter<
        d_in.CSV,
        d_out.Paragraph,
        {
            'separator': number
        }
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

export const CSV: interface_.CSV = ($, $p) => sh.pg.sentences(
    p_.from.list($).map(
        ($) => sh.sentence([
            sh.ph.rich(
                p_.from.list($,).map(
                    ($) => sh.ph.serialize(
                        p_.literal.segmented_list([
                            p_.literal.list([
                                0x22, //"
                            ]),
                            p_.from.list(p_list_from_text(
                                $,
                                ($) => $ === 0x22 //"
                                    ? p_.literal.list([0x22, 0x22]) //escape "
                                    : p_.literal.list([$]),
                            ),
                            ).flatten(
                                ($) => $
                            ),
                            p_.literal.list([
                                0x22, //"
                            ])
                        ])
                    )
                ),
                sh.ph.nothing(),
                sh.ph.nothing(),
                sh.ph.serialize(p_.literal.list([$p.separator])),
                sh.ph.nothing(),
            )
        ])
    ))

