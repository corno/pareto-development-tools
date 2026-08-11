import * as p_ from 'pareto-core/implementation/refiner'
import * as p_temp from 'pareto-core/implementation/transformer'
import * as p_schema from 'pareto-core/interface/schema'

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
        const temp: { [id: string]: s_out_fsa.Analyzed_Node } = {}

        // const internal2 = ($: s_out_fsa.Directory): s_out_fsa.Flattened_Tree => p_.from.state($).decide(
        //     ($) => {
        //         switch ($[0]) {
        //             case 'defined': return p_.ss($, ($) => )
        //             case 'expected a file':return p_.ss($, ($) => )
        //             case 'ignored': return p_.ss($, ($) => )
        //             case 'undefined': return p_.ss($, ($) => )
        //             default: return p_.au($[0])
        //         }
        //     }
        // )

        const internal_flatten_dir = ($: s_out_fsa.Directory, path: string): void => {
            p_.from.state($).decide(
                ($): null => {
                    switch ($[0]) {
                        case 'expected a file': return p_.option($, ($) => {
                            temp[`${path}`] = ['unexpected directory', null]
                            return null
                        })
                        case 'ignored': return p_.option($, ($) => null)
                        case 'defined': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = ['file', $]
                                                return null
                                            })
                                            case 'directory': return p_.option($, ($) => {
                                                internal_flatten_dir($, `${path}/${id}`)
                                                return null
                                            })
                                            default: return p_.exhaustive($[0])
                                        }
                                    }))
                            return null
                        })
                        case 'undefined': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = ['file', $]
                                                return null
                                            })
                                            case 'directory': return p_.option($, ($) => {
                                                internal_flatten_dir($, `${path}/${id}`)
                                                return null
                                            })
                                            default: return p_.exhaustive($[0])
                                        }
                                    }))
                            return null
                        })
                        case 'wildcard': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = ['file', $]
                                                return null
                                            })
                                            case 'directory': return p_.option($, ($) => {
                                                internal_flatten_dir($, `${path}/${id}`)
                                                return null
                                            })
                                            default: return p_.exhaustive($[0])
                                        }
                                    }))
                            return null
                        })
                        default: return p_.exhaustive($[0])
                    }
                }
            )
        }
        internal_flatten_dir($, "")
        return p_.literal.dictionary(temp)
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
