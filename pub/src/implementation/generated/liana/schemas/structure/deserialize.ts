
import * as _p from "pareto-core/dist/deserializer"

import {
    _p_unreachable_code_path,
} from "pareto-core/dist/unreachable_code_path"

import * as t_signatures from "../../../../../interface/generated/liana/schemas/structure/deserialize"

import * as v_deserialize from "astn-core/dist/implementation/manual/schemas/parse_tree/deserializers"

import * as v_unmarshall from "./unmarshall"

export const Directory: t_signatures.Directory = ($, abort, $p) => v_unmarshall.Directory(
    v_deserialize.Document(
        $,
        ($) => abort(
            ['tbd', null]
        ),
        ({
            'document resource identifier': $p['document resource identifier'],
            'tab size': $p['tab size'],
        })
    )['content'],
    ($) => abort(
        ['tbd', null]
    )
)
