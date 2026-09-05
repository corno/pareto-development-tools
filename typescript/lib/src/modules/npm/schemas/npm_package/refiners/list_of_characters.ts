import type * as p_ri from 'pareto-core/refiner'

//schemas
import type * as s_in from "astn-core/modules/deserialization/schemas/list_of_characters/schema"
import type * as s_out from "../schema.js"
import type * as s_error from "../../deserialize_package_json/schema.js"

//dependencies
import * as r_parse_tree_from_list_of_characters from "astn-core/modules/deserialization/schemas/parse_tree/refiners/list_of_characters"
import * as r_from_parse_tree from "./parse_tree.js"

export const NPM_Package: p_ri.Refiner<
    s_out.NPM_Package,
    s_error.Error['type'],
    s_in.List_Of_Characters
> = ($, abort) => {
    return r_from_parse_tree.NPM_Package(
        r_parse_tree_from_list_of_characters.Document(
            $,
            ($) => abort(['invalid ASTN', $]),
            {
                'tab size': 4,
            },
        ),
        ($) => abort($),
    )
}