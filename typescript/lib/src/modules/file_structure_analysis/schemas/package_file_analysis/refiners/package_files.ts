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
    export type Package_File_Analysis_Dictionary = p_.Refiner_Without_Error_With_Parameter<
        s_out.Package_File_Analysis_Dictionary,
        s_in.Package_Files,
        s_parameters.Parameters
    >
}

export const Package_File_Analysis_Dictionary: declarations.Package_File_Analysis_Dictionary = ($, $p) => {


    const Flatten_Directory: p_.Refiner_Without_Error<
        p_schema.Dictionary<s_out_fsa.File_Analysis>,
        s_out_fsa.Directory
    > = ($) => {
        const temp: { [id: string]: s_out_fsa.File_Analysis } = {}
        const internal_flatten_dir = ($: s_out_fsa.Directory, path: string): void => {
            p_.from.state($).decide(
                ($): null => {
                    switch ($[0]) {
                        case 'expected a file': return p_.option($, ($) => null)
                        case 'ignored': return p_.option($, ($) => null)
                        case 'defined directory': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = $
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
                        case 'undefined directory': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = $
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
                        case 'wildcard dictionary': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => p_.from.state($).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'other': return null //do nothing, ignore other filesystem nodes for now
                                            case 'file': return p_.option($, ($) => {
                                                temp[`${path}/${id}`] = $
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
