import * as p_ from 'pareto-core/implementation/refiner'
import * as p_temp from 'pareto-core/implementation/transformer'

//schemas
import type * as s_in_nested_directory_content from "pareto-filesystem-unrestricted-api/modules/helpers/schemas/nested_directory_content_as_read/schema"
import type * as s_structure from "../../structure/schema.js"

namespace s_xxx {
    export type Parameters = {
        'expected structure': s_structure.Directory,
        'structure path': s_path.Path,
    }
}

import type * as s_out from "../schema.js"
import type * as s_path from "../../path/schema.js"


//dependencies
import * as t_temp from "../../extension/deserializers.js"
import * as t_wildcard from "./wildcard.js"
import * as t_undefined from "./undefined.js"
import * as t_loc_to_line_count from "../../line_count/refiners/list_of_characters.js"

namespace declarations {

    export type Directory = p_.Refiner_Without_Error_With_Parameter<
        s_out.Directory,
        s_in_nested_directory_content.Directory,
        s_xxx.Parameters
    >
}

export const Directory: declarations.Directory = ($, $p) => {
    //both found and expected are directories

    const $v_dir = $
    return p_.from.state($p['expected structure']).decide(
        ($): s_out.Directory => {
            switch ($[0]) {

                case 'group': return p_.option($, ($) => {
                    const $v_expected = $
                    return ['defined directory', p_.from.dictionary($v_dir).map(
                        ($, id) => {
                            const node = $
                            const NodeX = (
                                $: s_in_nested_directory_content.Node,
                                $p: {
                                    'name': string,
                                    'expected structure': s_structure.Directory.group.D,
                                    'structure path': s_path.Path,
                                }
                            ): s_out.Node => p_.from.state($).decide(
                                ($): s_out.Node => {
                                    switch ($[0]) {
                                        case 'file': return p_.option($, ($): s_out.Node => ['file', ({
                                            'content': $.data,
                                            'structure': {
                                                'path': $p['structure path'],
                                                'classification': p_.from.state($p['expected structure']).decide(
                                                    ($): s_out.Classification => {
                                                        switch ($[0]) {
                                                            case 'file': return p_.option($, ($) => p_.from.state($).decide(
                                                                ($) => {
                                                                    switch ($[0]) {
                                                                        case 'generated': return p_.option($, ($) => ['file', ['generated', null]])
                                                                        case 'manual': return p_.option($, ($) => ['file', ['manual', null]])
                                                                        default: return p_.exhaustive($[0])
                                                                    }
                                                                }))
                                                            case 'directory': return p_.option($, ($) => ['directory', p_.from.state($).decide(
                                                                ($): s_out.Directory_Classification => {
                                                                    switch ($[0]) {
                                                                        case 'wildcards': return p_.option($, ($) => ['wildcards', null])
                                                                        case 'freeform': return p_.option($, ($) => ['freeform', null])
                                                                        case 'ignore': return p_.option($, ($) => ['ignored', null])
                                                                        case 'generated': return p_.option($, ($) => ['generated', null])
                                                                        case 'dictionary': return p_.option($, ($) => ['dictionary', null])
                                                                        case 'group': return p_.option($, ($) => ['group', null])
                                                                        default: return p_.exhaustive($[0])
                                                                    }
                                                                })])
                                                            default: return p_.exhaustive($[0])
                                                        }
                                                    })
                                            },
                                            'extension': t_temp.extension($p['name']),
                                            'unexpected path tail': p_.from.state($p['expected structure']).decide(
                                                ($) => {
                                                    switch ($[0]) {
                                                        case 'file': return p_.option($, ($) => p_.from.state($).decide(
                                                            ($) => {
                                                                switch ($[0]) {
                                                                    case 'generated': return p_.option($, ($) => p_.literal.not_set())
                                                                    case 'manual': return p_.option($, ($) => p_.literal.not_set())
                                                                    default: return p_.exhaustive($[0])
                                                                }
                                                            }))
                                                        case 'directory': return p_.option($, ($) => p_.literal.set(p_.literal.list([
                                                            $p['name'],
                                                        ])))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                })
                                        })])
                                        case 'directory': return p_.option($, ($): s_out.Node => {
                                            //found a directory in the filesystem, check expected structure
                                            const dir = $
                                            return ['directory', p_.from.state($p['expected structure']).decide(
                                                ($): s_out.Directory => {
                                                    switch ($[0]) {
                                                        case 'file': return p_.option($, ($) => ['expected a file', null])
                                                        case 'directory': return p_.option($, ($) => Directory(
                                                            dir,
                                                            {
                                                                'expected structure': $,
                                                                'structure path': $p['structure path'],
                                                            }
                                                        ))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                })]
                                        })
                                        case 'other': return p_.option($, ($) => ['other', null])
                                        default: return p_.exhaustive($[0])
                                    }
                                })
                            return p_temp.from.dictionary($v_expected).get_possible_entry(
                                id,
                                ($) => NodeX(
                                    node,
                                    {
                                        'name': id,
                                        'expected structure': $,
                                        'structure path': p_.literal.chain(
                                            $p['structure path'],
                                            id,
                                        ),
                                    }
                                ),
                                () => t_undefined.Node( //no expected structure for this entry
                                    $,
                                    {
                                        'name': id,
                                        'structure': {
                                            'classification': ['directory', ['group', null]],
                                            'path': $p['structure path'],
                                        },
                                        'unexpected path tail': p_.literal.set(p_.literal.list([
                                            id,
                                        ])),
                                    }
                                )
                            )
                        })]
                })
                case 'ignore': return p_.option($, ($) => ['ignored', null])
                case 'generated': return p_.option($, ($) => t_undefined.Directory(
                    $v_dir,
                    {
                        'structure': {
                            'classification': ['directory', ['generated', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': p_.literal.not_set(),
                    }
                ))
                case 'wildcards': return p_.option($, ($) => t_wildcard.Directory(
                    $v_dir,
                    {
                        'wildcard': $,
                        'structure path': $p['structure path'],
                        'tail': p_.literal.list([]),
                        'number of directories encountered': 0,
                    }
                ))
                case 'freeform': return p_.option($, ($) => t_undefined.Directory(
                    $v_dir,
                    {
                        'structure': {
                            'classification': ['directory', ['freeform', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': p_.literal.not_set(),
                    }
                ))
                case 'dictionary': return p_.option($, ($) => {
                    //expecting a dictionary of directories
                    const struct = $

                    return ['defined directory', p_.from.dictionary($v_dir).map(
                        ($, id): s_out.Node => p_.from.state($).decide(
                            ($): s_out.Node => {
                                switch ($[0]) {
                                    case 'directory': return p_.option($, ($) => ['directory', Directory(
                                        $,
                                        {
                                            'expected structure': struct,
                                            'structure path': p_.literal.chain(
                                                $p['structure path'],
                                                "*",
                                            )
                                        }
                                    )])
                                    case 'other': return p_.option($, ($) => ['other', null])
                                    case 'file': return p_.option($, ($): s_out.Node => ['file', {
                                        'content': $.data,
                                        'structure': {
                                            'path': p_.literal.chain(
                                                $p['structure path'],
                                                "*",
                                            ),
                                            'classification': ['directory', ['dictionary', null]],
                                        },
                                        'extension': t_temp.extension(id),
                                        'unexpected path tail': p_.literal.set(p_.literal.list([
                                            id,
                                        ])),
                                    }])
                                    default: return p_.exhaustive($[0])
                                }
                            }
                        )
                    )]
                })
                default: return p_.exhaustive($[0])
            }
        }
    )
}