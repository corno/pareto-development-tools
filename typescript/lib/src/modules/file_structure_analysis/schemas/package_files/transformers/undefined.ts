import * as p_ from 'pareto-core/implementation/transformer'
import * as p_schema from 'pareto-core/interface/schema'

//schemas
import type * as s_in_nested_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/nested_directory_content_as_read/schema"
import type * as s_structure from "../../structure/schema.js"

namespace s_xxx {
    export type Parameters = {
        'expected structure': s_structure.Directory,
        'structure path': s_path.Path,
    }
}
import type * as p_di from 'pareto-core/interface/schema'
import type * as s_in from "../schema.js"
import type * as s_out from "../../file_structure_analysis/schema.js"
import type * as s_path from "../../path/schema.js"


//dependencies
import * as t_temp from "./temp.js"
import * as t_loc_to_line_count from "../../list_of_characters/transformers/line_count.js"

namespace declarations {
    export type Directory = p_.Transformer_With_Parameter<
        s_in_nested_directory_content.Directory,
        s_out.Directory,
        {
            'structure': s_out.Structure_Analysis,
            'unexpected path tail': p_di.Optional_Value<s_path.Path>,
        }
    >
    export type Node = p_.Transformer_With_Parameter<
        s_in_nested_directory_content.Node,
        s_out.Node,
        {
            'structure': s_out.Structure_Analysis,
            'name': string,
            'unexpected path tail': p_di.Optional_Value<s_path.Path>,
        }
    >
}

//data
// import { $$ as x_structure } from "../../../data/structure.js"




export const Directory: declarations.Directory = ($, $p) => {
    return ['dictionary', p_.from.dictionary($).map(
        ($, id) => Node(
            $,
            {
                'name': id,
                'structure': $p.structure,
                'unexpected path tail': p_.from.optional($p['unexpected path tail']).map(
                    ($) => p_.literal.chain(
                        $,
                        id,
                    )),
            }
        ))]
}

export const Node: declarations.Node = ($, $p) => {
    return p_.from.state($).decide(
        ($): s_out.Node => {
            switch ($[0]) {
                case 'file': return p_.option($, ($): s_out.Node => ['file', {
                    'unexpected path tail': $p['unexpected path tail'],
                    'structure': $p['structure'],
                    'extension': t_temp.extension($p['name']),
                    'line count': t_loc_to_line_count.line_count($.data),
                }])
                case 'directory': return p_.option($, ($) => {
                    return ['directory', Directory(
                        $,
                        {
                            'structure': $p.structure,
                            'unexpected path tail': $p['unexpected path tail'],
                        }
                    )]
                })
                case 'other': return p_.option($, ($) => ['other', null])
                default: return p_.exhaustive($[0])
            }
        }
    )
}