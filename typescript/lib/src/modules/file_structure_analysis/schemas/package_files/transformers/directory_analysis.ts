import * as p_ from 'pareto-core/implementation/transformer'
import * as p_schema from 'pareto-core/interface/schema'


//schemas
import type * as s_structure from "../../structure/schema.js"

import type * as s_in from "../schema.js"
import type * as s_out from "../../file_structure_analysis/schema.js"

//dependencies
import * as t_defined from "./defined.js"

namespace declarations {
    export type Package_Files = p_.Transformer_With_Parameter<
        s_in.Package_Files,
        s_out.Package_File_Analysis_List,
        {
            'structure': s_structure.Directory,
        }
    >
}

export const Package_Files: declarations.Package_Files = ($, $p) => {

    const Directory2: p_.Transformer<
        s_out.Directory,
        p_schema.Dictionary<s_out.File_Analysis>
    > = ($) => {
        const temp: { [id: string]: s_out.File_Analysis } = {}
        const x = ($: s_out.Directory, path: string): void => {
            p_.from.state($).decide(
                ($): null => {
                    switch ($[0]) {
                        case 'expected a file': return p_.option($, ($) => {
                            return null
                        })
                        case 'ignored': return p_.option($, ($) => {
                            return null
                        })
                        case 'dictionary': return p_.option($, ($) => {
                            p_.from.dictionary($).map(
                                ($, id) => {

                                    return p_.from.state($).decide(
                                        ($): null => {
                                            switch ($[0]) {
                                                case 'other': return null //do nothing, ignore other filesystem nodes for now
                                                case 'file': return p_.option($, ($) => {
                                                    temp[`${path}/${id}`] = $
                                                    return null
                                                })
                                                case 'directory': return p_.option($, ($) => {
                                                    x($, `${path}/${id}`)
                                                    return null
                                                })
                                                default: return p_.exhaustive($[0])
                                            }
                                        })
                                })
                            return null
                        })
                        default: return p_.exhaustive($[0])
                    }
                })

        }
        x($, "")
        return p_.literal.dictionary(temp)
    }
    return p_.from.dictionary(
        Directory2(
            t_defined.Directory(
                $,
                {
                    'expected structure': $p.structure,
                    'structure path': p_.literal.list([]),
                }
            )
        ),
    ).convert_to_list(
        ($, id) => ({
            'path': id,
            'analysis': $,
        })
    )
}

