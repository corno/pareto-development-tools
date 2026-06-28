import * as p_ri from 'pareto-core/dist/interface/refiner'

//data types
import * as d_in from "pareto-fountain-pen/dist/interface/generated/liana/schemas/list_of_characters/data"
import * as d_out from "../../../../interface/data/npm_package"
import * as d_function from "../../../../interface/data/deserialize_package_json"

//dependencies
import * as r_parse_tree_from_list_of_characters from "astn-core/dist/implementation/manual/refiners/parse_tree/list_of_characters"
import * as r_from_parse_tree from "./parse_tree"

export const NPM_Package: p_ri.Refiner<
    d_out.NPM_Package,
    d_function.Error['type'],
    d_in.List_of_Characters
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