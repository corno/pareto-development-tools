import type * as p_ri from 'pareto-core/interface/refiner'

//schemas
import type * as s_in from "pareto-fountain-pen/interface/data/list_of_characters"
import type * as s_out from "../../../interface/schemas/npm_package.js"
import type * as s_function from "../../../interface/schemas/deserialize_package_json.js"

//dependencies
import * as r_parse_tree_from_list_of_characters from "astn-core/implementation/refiners/parse_tree/list_of_characters"
import * as r_from_parse_tree from "./parse_tree.js"

export const NPM_Package: p_ri.Refiner<
    s_out.NPM_Package,
    s_function.Error['type'],
    s_in.List_of_Characters
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