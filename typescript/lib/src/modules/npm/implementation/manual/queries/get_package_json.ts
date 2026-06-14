import * as _p from 'pareto-core/dist/query'
import * as _pi from 'pareto-core/dist/interface'
import * as _p_temp from 'pareto-core/dist/assign'
import _p_change_context from 'pareto-core/dist/_p_change_context'
import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_package_json"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/unrestricted_path"
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/transformers/unrestricted_path/text"
import { $$ as r_parse_npm_package } from "../transformers/npm_package/text"

export const $$: signatures.queries.get_package_json = _p.query_function(
    ($d, $s, $r) => _p_change_context($d, ($p) => {
        const path = t_path_to_path.create_node_path($p['path to package'], { 'node': "package.json" })
        return $r['read file'](
            path,
            ($): d.Error => ['error while reading package.json', $],
        ).refine(
            ($, abort) => r_parse_npm_package(
                $,
                ($) => abort(['error while parsing package.json', {
                    'type': $,
                    'path': path,
                }]),
            )
        )
    })
)

    