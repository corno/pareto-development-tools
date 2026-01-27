import * as _p from 'pareto-core/dist/query'
import * as _pi from 'pareto-core/dist/interface'
import * as _p_temp from 'pareto-core/dist/transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/get_package_json"
// import * as d_npm_package from "../../../modules/npm/interface/to_be_generated/npm_package"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"
import { $$ as r_parse_npm_package } from "../schemas/npm_package/refiners/temp"

export const $$: signatures.queries.get_package_json = _p.query_function(
    ($p, $r) => _p_temp.deprecated_cc($p, ($p) => {
        const path = t_path_to_path.create_node_path($p['path to package'], `package.json`)
        return $r['read file'](
            path,
            ($): d.Error => ['error while reading package.json', $],
        ).refine_without_error_transformation(
            ($, abort) => r_parse_npm_package(
                $,
                ($) => abort(['error while parsing package.json', $]),
                {
                    'uri': s_path.Node_Path(path),
                }
            )
        )
    })
)

    