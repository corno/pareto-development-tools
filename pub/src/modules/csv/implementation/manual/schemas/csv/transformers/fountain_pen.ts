import * as _p from 'pareto-core/dist/expression'
import * as _pi from 'pareto-core/dist/interface'
import _list_from_text from 'pareto-core/dist/_p_list_from_text'

//data types
import * as d_out from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"
import * as d_in from "../../../../../interface/to_be_generated/csv"


export type Signature = _pi.Transformer_With_Parameters<
    d_in.CSV,
    d_out.Paragraph,
    {
        'separator': number
    }
>

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const CSV: Signature = ($, $p) => sh.pg.sentences(_p.list.map(
    $,
    ($) => sh.ph.rich(
        _p.list.map(
            $,
            ($) => sh.ph.serialize(
                _p.list.nested_literal_old([
                    [
                        0x22, //"
                    ],
                    _p.list.flatten(
                        _list_from_text(
                            $,
                            ($) => $ === 0x22 //"
                                ? _p.list.literal([0x22, 0x22]) //escape "
                                : _p.list.literal([$]),
                        ),
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
        sh.ph.serialize(_p.list.literal([$p.separator])),
        sh.ph.nothing(),
    )
))

