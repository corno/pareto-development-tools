import * as p_ from 'pareto-core/implementation/transformer'

import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/implementation/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

//schemas
import type * as s_in_directory_content from "../../../interface/schemas/directory_content.js"
import type * as s_structure from "../../../interface/schemas/structure.js"

namespace s_xxx {
    export type Parameters = {
        'expected structure': s_structure.Directory,
        'structure path': s_out.Path,
    }
}
import type * as p_di from 'pareto-core/interface/data'
import type * as s_in from "../../../interface/schemas/project_files.js"
import type * as s_out from "../../../interface/schemas/file_structure_analysis.js"

namespace declarations {
    export type line_count = p_.Transformer<
        string,
        number
    >
    export type extension = p_.Transformer<
        string,
        p_di.Optional_Value<string>
    >
    export type Project_Files = p_.Transformer_With_Parameter<
        s_in.Project_Files,
        s_out.File_Analysis_List,
        {
            'structure': s_structure.Directory,
        }
    >
    export namespace wildcard {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            {
                'wildcard': s_structure.Directory.wildcards,
                'structure path': s_out.Path,
                'tail': s_out.Path,
                'number of directories encountered': number,
            }
        >

    }
    export namespace defined {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            s_xxx.Parameters
        >

    }
    export namespace undefined {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            {
                'structure': s_out.Structure_Analysis,
                'unexpected path tail': p_di.Optional_Value<s_out.Path>,
            }
        >
        export type Node = p_.Transformer_With_Parameter<
            s_in_directory_content.Node,
            s_out.Node,
            {
                'structure': s_out.Structure_Analysis,
                'name': string,
                'unexpected path tail': p_di.Optional_Value<s_out.Path>,
            }
        >

    }




}

//data
// import { $$ as x_structure } from "../../../data/structure.js"


export const Project_Files: declarations.Project_Files = ($, $p) => p_.from.dictionary($).flatten_to_list(
    ($, id): s_out.File_Analysis_List => {
        const package_name = id
        const Directory2 = ($: s_out.Directory): s_out.Flattened_Directory_With_Line_Counts => {
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
        return p_.from.dictionary(Directory2(
            defined.Directory(
                $,
                {
                    'expected structure': $p.structure,
                    'structure path': p_.literal.list([]),
                }
            )
        ),
        ).convert_to_list(
            ($, id) => ({
                'package': package_name,
                'path': id,
                'analysis': $,
            })
        )
    }
)




const line_count: declarations.line_count = ($) => {
    let lineCount = 0
    p_.from.list(p_list_from_text(
        $,
        ($) => $
    )).map(
        ($) => {
            if ($ === 10) { //newline character
                lineCount++
            }
            return null
        })
    return lineCount + 1 //add one for the last line if it doesn't end with a newline
}

const extension: declarations.extension = ($) => {
    const $v_characters = p_list_from_text(
        $,
        ($) => $
    )

    let first_period_index: null | number = null
    let current_index = 0
    p_.from.list($v_characters).map(
        ($) => {
            if ($ === 46) { //period
                first_period_index = current_index
            }
            current_index++
            return null
        })
    if (first_period_index === null) {
        return p_.literal.not_set()
    } else {
        const fpi: number = first_period_index
        current_index = 0
        return p_.literal.set(
            p_text_from_list(
                p_list_build_deprecated<number>(
                    ($i) => {
                        p_.from.list($v_characters).map(
                            ($) => {
                                if (current_index > fpi) {
                                    $i['add item']($)
                                }
                                current_index++
                                return null
                            })
                    }),
                ($) => $
            )
        )
    }
}
namespace defined {

    export const Directory: declarations.defined.Directory = ($, $p) => {
        //both found and expected are directories

        const $v_dir = $
        return p_.from.state($p['expected structure']).decide(
            ($): s_out.Directory => {
                switch ($[0]) {

                    case 'group': return p_.option($, ($) => {
                        const $v_expected = $
                        return ['dictionary', p_.from.dictionary($v_dir).map(
                            ($, id) => {
                                const node = $
                                const NodeX = (
                                    $: s_in_directory_content.Node,
                                    $p: {
                                        'name': string,
                                        'expected structure': s_structure.Directory.group.D,
                                        'structure path': s_out.Path,
                                    }
                                ): s_out.Node => p_.from.state($).decide(
                                    ($): s_out.Node => {
                                        switch ($[0]) {
                                            case 'file': return p_.option($, ($): s_out.Node => ['file', ({
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
                                                'extension': extension($p['name']),
                                                'line count': line_count($),
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
                                return p_.from.dictionary($v_expected).get_possible_entry(
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
                                    () => undefined.Node( //no expected structure for this entry
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
                    case 'generated': return p_.option($, ($) => undefined.Directory(
                        $v_dir,
                        {
                            'structure': {
                                'classification': ['directory', ['generated', null]],
                                'path': $p['structure path'],
                            },
                            'unexpected path tail': p_.literal.not_set(),
                        }
                    ))
                    case 'wildcards': return p_.option($, ($) => wildcard.Directory(
                        $v_dir,
                        {
                            'wildcard': $,
                            'structure path': $p['structure path'],
                            'tail': p_.literal.list([]),
                            'number of directories encountered': 0,
                        }
                    ))
                    case 'freeform': return p_.option($, ($) => undefined.Directory(
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

                        return ['dictionary', p_.from.dictionary($v_dir).map(
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
                                            'structure': {
                                                'path': p_.literal.chain(
                                                    $p['structure path'],
                                                    "*",
                                                ),
                                                'classification': ['directory', ['dictionary', null]],
                                            },
                                            'extension': extension(id),
                                            'line count': line_count($),
                                            'unexpected path tail': p_.literal.set(p_.literal.list([
                                                id,
                                            ])),
                                        }])
                                        default: return p_.exhaustive($[0])
                                    }
                                }))]
                    })
                    default: return p_.exhaustive($[0])
                }
            })
    }

}

namespace undefined {

    export const Directory: declarations.undefined.Directory = ($, $p) => {
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

    export const Node: declarations.undefined.Node = ($, $p) => {
        return p_.from.state($).decide(
            ($): s_out.Node => {
                switch ($[0]) {
                    case 'file': return p_.option($, ($): s_out.Node => ['file', {
                        'unexpected path tail': $p['unexpected path tail'],
                        'structure': $p['structure'],
                        'extension': extension($p['name']),
                        'line count': line_count($),
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
            })
    }

}

namespace wildcard {

    export const Directory: declarations.wildcard.Directory = ($, $p) => {
        return ['dictionary', p_.from.dictionary($).map(
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
                                'structure': {
                                    'path': $p['structure path'],
                                    'classification': ['directory', ['wildcards', null]],
                                },
                                'extension': extension(id),
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
                                    p_.from.optional(extension(id)).map(
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
                                'line count': line_count($),
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
                    })
            })]
    }


}


