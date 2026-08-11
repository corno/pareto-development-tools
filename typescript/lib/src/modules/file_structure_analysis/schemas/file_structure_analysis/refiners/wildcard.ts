import * as p_ from 'pareto-core/implementation/refiner'
import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

//schemas
import type * as s_in_nested_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/nested_directory_content_as_read/schema"
import type * as s_structure from "../../structure/schema.js"

import type * as s_out from "../schema.js"
import type * as s_path from "../../path/schema.js"

//dependencies
import * as t_temp from "../../extension/deserializers.js"

namespace declarations {
    export type Directory = p_.Refiner_Without_Error_With_Parameter<
        s_out.Directory,
        s_in_nested_directory_content.Directory,
        {
            'wildcard': s_structure.Directory.wildcards,
            'structure path': s_path.Path,
            'tail': s_path.Path,
            'number of directories encountered': number,
        }
    >
}


    export const Directory: declarations.Directory = ($, $p) => {
        return ['wildcard', p_.from.dictionary($).map(
            ($, id) => {
                const tail = p_.literal.chain(
                    $p.tail,
                    id,
                )
                return p_.from.state($).decide(
                    ($): s_out.Node => {
                        switch ($[0]) {
                            case 'other': return p_.option($, ($) => ['other', null])
                            case 'file': return p_.option($, ($): s_out.Node => ['file', {
                                'content': $.data,
                                'structure': {
                                    'path': $p['structure path'],
                                    'classification': ['directory', ['wildcards', null]],
                                },
                                'extension': t_temp.extension(id),
                                'unexpected path tail': p_change_context($, ($): s_out.File_Analysis['unexpected path tail'] => {
                                    if ($p['number of directories encountered'] < $p['wildcard']['required directories']) {
                                        //files are not allowed yet, haven't descended through enough required directories
                                        return p_.literal.set(tail)
                                    }
                                    if (!$p.wildcard['additional directories allowed'] && $p['number of directories encountered'] > $p['wildcard']['required directories']) {
                                        //additional directories are not allowed and we've gone too deep
                                        return p_.literal.set(tail)
                                    }
                                    let extension_matched = false
                                    p_.from.optional(t_temp.extension(id)).map(
                                        ($) => {
                                            const file_extension = $
                                            p_.from.list($p['wildcard']['extensions']).map(
                                                ($) => {
                                                    if ($ === file_extension) {
                                                        extension_matched = true
                                                    }
                                                    return null
                                                })
                                            return null
                                        })
                                    return extension_matched
                                        ? p_.literal.not_set()
                                        : p_.literal.set(tail)

                                }),
                            }])
                            case 'directory': return ['directory', p_.option($, ($) => {
                                return Directory(
                                    $,
                                    {
                                        'tail': tail,
                                        'wildcard': $p.wildcard,
                                        'structure path': $p['structure path'],
                                        'number of directories encountered': $p['number of directories encountered'] + 1
                                    }
                                )
                            })]
                            default: return p_.exhaustive($[0])
                        }
                    }
                )
            }
        )]
    }

