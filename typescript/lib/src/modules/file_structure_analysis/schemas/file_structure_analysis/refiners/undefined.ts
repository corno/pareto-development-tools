import * as p_ from 'pareto-core/implementation/refiner'

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
import type * as s_out from "../schema.js"
import type * as s_path from "../../path/schema.js"


//dependencies
import * as t_temp from "../../extension/deserializers.js"
import * as t_loc_to_line_count from "../../line_count/refiners/list_of_characters.js"

namespace declarations {
    export type Directory = p_.Refiner_Without_Error_With_Parameter<
        s_out.Directory,
        s_in_nested_directory_content.Directory,
        {
            'structure': s_out.Structure_Analysis,
            'unexpected path tail': p_di.Optional_Value<s_path.Path>,
        }
    >
    export type Node = p_.Refiner_Without_Error_With_Parameter<
        s_out.Node,
        s_in_nested_directory_content.Node,
        {
            'structure': s_out.Structure_Analysis,
            'name': string,
            'unexpected path tail': p_di.Optional_Value<s_path.Path>,
        }
    >
}

export const Directory: declarations.Directory = ($, $p) => {
    return ['undefined directory', p_.from.dictionary($).map(
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
                    'content': $.data,
                    'unexpected path tail': $p['unexpected path tail'],
                    'structure': $p['structure'],
                    'extension': t_temp.extension($p['name']),
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