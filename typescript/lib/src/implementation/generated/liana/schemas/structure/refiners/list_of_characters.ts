
import * as p_ from 'pareto-core/implementation/refiner'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/signatures/refiners/list_of_characters.js"

import * as v_deserialize from "astn-core/implementation/manual/refiners/parse_tree/list_of_characters"

import * as v_unmarshall from "./astn_parse_tree.js"

export const Directory: t_signatures.Directory = ($, abort, $p) => v_unmarshall.Directory(
    v_deserialize.Document(
        $,
        ($) => abort(
            ['parse error', $],
        ),
        {
            'tab size': $p['tab size'],
        },
    )['content'],
    ($) => abort(
        ['unmarshall error', $],
    ),
)
