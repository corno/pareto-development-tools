import * as p_ from 'pareto-core/refiner'
import * as p_temp from 'pareto-core/transformer'
import * as p_schema from 'pareto-core/schema'
import * as p_single_entry_dictionary from '../../../../../temp/single_entry_dictionary.js'
import p_unreachable_code_path from 'pareto-core/transformer/specials/unreachable_code_path'

//schemas
import type * as s_structure from "../../structure/schema.js"
import type * as s_in from "../../package_files/schema.js"
import type * as s_out from "../schema.js"
import type * as s_out_fsa from "../../file_structure_analysis/schema.js"


namespace s_parameters {
    export type Parameters = {
        'structure': s_structure.Directory,
    }
}

//dependencies
import * as t_defined from "../../file_structure_analysis/refiners/defined.js"

namespace declarations {
    export type Analyzed_Package_Nodes = p_.Refiner_Without_Error_With_Parameter<
        s_out.Analyzed_Package_Nodes,
        s_in.Package_Files,
        s_parameters.Parameters
    >
}

export const Analyzed_Package_Nodes: declarations.Analyzed_Package_Nodes = ($, $p) => {

    /**
     * converts the nested directory structure into a flat dictionary of file paths and their corresponding analysis results
     */
    const Flatten_Directory: p_.Refiner_Without_Error<
        p_schema.Dictionary<s_out_fsa.Analyzed_Node>,
        s_out_fsa.Directory
    > = ($) => {

        type Temp_Node =
            | ['composed', p_schema.Dictionary<Temp_Node>]
            | ['leaf', s_out_fsa.Analyzed_Node]

        const my_flatten = ($: s_out_fsa.Directory): Temp_Node => p_.from.state($).decide(
            ($): Temp_Node => {
                switch ($[0]) {
                    case 'expected a file': return p_.option($, ($) => ['leaf', ['unexpected directory', null]])
                    case 'ignored': return p_.option($, ($) => ['composed', p_.literal.dictionary({})])
                    case 'defined': return p_.option($, ($) => ['composed', p_.from.dictionary($).map(
                        ($, id) => p_.from.state($).decide(
                            ($): Temp_Node => {
                                switch ($[0]) {
                                    case 'other': return ['composed', p_.literal.dictionary({})] //do nothing, ignore other filesystem nodes for now
                                    case 'file': return p_.option($, ($) => {
                                        return ['leaf', ['file', $]]
                                    })
                                    case 'directory': return p_.option($, ($) => my_flatten($))
                                    default: return p_.exhaustive($[0])
                                }
                            }
                        )
                    )])
                    case 'undefined': return p_.option($, ($) => ['composed', p_.from.dictionary($).map(
                        ($, id) => p_.from.state($).decide(
                            ($): Temp_Node => {
                                switch ($[0]) {
                                    case 'other': return ['composed', p_.literal.dictionary({})] //do nothing, ignore other filesystem nodes for now
                                    case 'file': return p_.option($, ($) => ['leaf', ['file', $]])
                                    case 'directory': return p_.option($, ($) => my_flatten($))
                                    default: return p_.exhaustive($[0])
                                }
                            })
                    )])
                    case 'wildcard': return p_.option($, ($) => ['composed', p_.from.dictionary($).map(
                        ($, id) => p_.from.state($).decide(
                            ($): Temp_Node => {
                                switch ($[0]) {
                                    case 'other': return ['composed', p_.literal.dictionary({})] //do nothing, ignore other filesystem nodes for now
                                    case 'file': return p_.option($, ($) => ['leaf', ['file', $]])
                                    case 'directory': return p_.option($, ($) => my_flatten($))
                                    default: return p_.exhaustive($[0])
                                }
                            }
                        )
                    )])
                    default: return p_.exhaustive($[0])
                }
            }
        )

        const foo = ($: Temp_Node): p_schema.Dictionary<s_out_fsa.Analyzed_Node> => p_.from.state($).decide(
            ($): p_schema.Dictionary<s_out_fsa.Analyzed_Node> => {
                switch ($[0]) {
                    case 'composed': return p_.option($, ($): p_schema.Dictionary<s_out_fsa.Analyzed_Node> => p_temp.from.dictionary($).flatten(
                        ($): p_schema.Dictionary<s_out_fsa.Analyzed_Node> => foo($),
                        (parent, child) => parent + "/" + child,
                        {
                            'duplicate_id': p_unreachable_code_path("node names do not contain slashes")
                        }
                    ))
                    case 'leaf': return p_.option($, ($) => p_single_entry_dictionary.single_entry_dictionary(
                        "",
                        $
                    ))
                    default: return p_.exhaustive($[0])
                }
            }
        )
        return foo(
            my_flatten(
                $
            ),
        )
    }
    return Flatten_Directory(
        t_defined.Directory(
            $,
            {
                'expected structure': $p.structure,
                'structure path': p_.literal.list([]),
            }
        )
    )
}
