import * as p_ from 'pareto-core/dist/implementation/transformer'
import * as p_di from 'pareto-core/dist/interface/data'
import * as p_i from 'pareto-core/dist/interface/transformer'

import p_list_from_text from 'pareto-core/dist/implementation/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/dist/implementation/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/dist/implementation/specials/text_from_list'
import p_change_context from 'pareto-core/dist/implementation/specials/change_context'

//data types
import * as d_in from "../../../../interface/data/project_files"
import * as d_in_directory_content from "pareto-resources/dist/interface/data/directory_content"
import * as d_out from "../../../../interface/data/file_structure_analysis"
import * as d_structure from "../../../../interface/generated/liana/schemas/structure/data"

//data
import { $$ as x_structure } from "../../../../data/structure"

export type Parameters = {
    'expected structure': d_structure.Directory,
    'structure path': string,
}



export namespace interface_ {

    export type line_count = p_i.Transformer<
        string,
        number
    >

    export type extension = p_i.Transformer<
        string,
        p_di.Optional_Value<string>
    >

    export type Project_Files = p_i.Transformer<
        d_in.Project_Files,
        d_out.File_Analysis_List
    >


    export namespace defined {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            Parameters
        >

    }

    export namespace undefined {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            {
                'structure': d_out.Structure_Analysis,
                'unexpected path tail': p_di.Optional_Value<string>,
            }
        >

        export type Node = p_i.Transformer_With_Parameter<
            d_in_directory_content.Node,
            d_out.Node,
            {
                'structure': d_out.Structure_Analysis,
                'name': string,
                'unexpected path tail': p_di.Optional_Value<string>,
            }
        >

    }

    export namespace wildcard {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            {
                'wildcard': d_structure.Directory.wildcards,
                'structure path': string,
                'tail': string,
                'number of directories encountered': number,
            }
        >

    }

}



export const Project_Files: interface_.Project_Files = ($) => p_.from.dictionary(
    $
).flatten_to_list(
    ($, id) => {
        const package_name = id
        const Directory2 = ($: d_out.Directory): d_out.Flattened_Directory_With_Line_Counts => {
            const temp: { [id: string]: d_out.File_Analysis } = {}
            const x = ($: d_out.Directory, path: string): void => {
                p_.from.state($).decide( ($): null => {
                    switch ($[0]) {
                        case 'expected a file': return p_.ss($, ($) => {
                            return null
                        })
                        case 'ignored': return p_.ss($, ($) => {
                            return null
                        })
                        case 'dictionary': return p_.ss($, ($) => {
                            $.__d_map_deprecated(($, id) => {

                                return p_.from.state($).decide(($): null => {
                                    switch ($[0]) {
                                        case 'other': return null //do nothing, ignore other filesystem nodes for now
                                        case 'file': return p_.ss($, ($) => {
                                            temp[`${path}/${id}`] = $
                                            return null
                                        })
                                        case 'directory': return p_.ss($, ($) => {
                                            x($, `${path}/${id}`)
                                            return null
                                        })
                                        default: return p_.au($[0])
                                    }
                                })
                            })
                            return null
                        })
                        default: return p_.au($[0])
                    }
                })

            }
            x($, "")
            return p_.literal.dictionary(temp)
        }
        return p_.from.dictionary(
            Directory2(
                defined.Directory(
                    $,
                    {
                        'expected structure': x_structure,
                        'structure path': "",
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




const line_count: interface_.line_count = ($) => {
    let lineCount = 0
    p_list_from_text(
        $,
        ($) => $
    ).__l_map_deprecated(($) => {
        if ($ === 10) { //newline character
            lineCount++
        }
        return null
    })
    return lineCount + 1 //add one for the last line if it doesn't end with a newline
}

const extension: interface_.extension = ($) => {
    const characters = p_list_from_text(
        $,
        ($) => $
    )

    let first_period_index: null | number = null
    let current_index = 0
    characters.__l_map_deprecated(($) => {
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
                p_list_build_deprecated<number>(($i) => {
                    characters.__l_map_deprecated(($) => {
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
export namespace defined {

    export const Directory: interface_.defined.Directory = ($, $p) => {
        //both found and expected are directories

        const dir = $
        return p_.from.state($p['expected structure']).decide( ($): d_out.Directory => {
            switch ($[0]) {

                case 'group': return p_.ss($, ($) => {
                    const expected = $
                    return ['dictionary', dir.__d_map_deprecated(($, id) => {
                        const node = $
                        const NodeX = (
                            $: d_in_directory_content.Node,
                            $p: {
                                'name': string,
                                'expected structure': d_structure.Directory.group.D,
                                'structure path': string,
                            }
                        ): d_out.Node => p_.from.state($).decide(($): d_out.Node => {
                            switch ($[0]) {
                                case 'file': return p_.ss($, ($): d_out.Node => ['file', ({
                                    'structure': {
                                        'path': $p['structure path'],
                                        'classification': p_.from.state($p['expected structure']).decide(($): d_out.Classification => {
                                            switch ($[0]) {
                                                case 'file': return p_.ss($, ($) => p_.from.state($).decide(($) => {
                                                    switch ($[0]) {
                                                        case 'generated': return p_.ss($, ($) => ['file', ['generated', null]])
                                                        case 'manual': return p_.ss($, ($) => ['file', ['manual', null]])
                                                        default: return p_.au($[0])
                                                    }
                                                }))
                                                case 'directory': return p_.ss($, ($) => ['directory', p_.from.state($).decide(($): d_out.Directory_Classification => {
                                                    switch ($[0]) {
                                                        case 'wildcards': return p_.ss($, ($) => ['wildcards', null])
                                                        case 'freeform': return p_.ss($, ($) => ['freeform', null])
                                                        case 'ignore': return p_.ss($, ($) => ['ignored', null])
                                                        case 'generated': return p_.ss($, ($) => ['generated', null])
                                                        case 'dictionary': return p_.ss($, ($) => ['dictionary', null])
                                                        case 'group': return p_.ss($, ($) => ['group', null])
                                                        default: return p_.au($[0])
                                                    }
                                                })])
                                                default: return p_.au($[0])
                                            }
                                        })
                                    },
                                    'extension': extension($p['name']),
                                    'line count': line_count($),
                                    'unexpected path tail': p_.from.state($p['expected structure']).decide(($) => {
                                        switch ($[0]) {
                                            case 'file': return p_.ss($, ($) => p_.from.state($).decide(($) => {
                                                switch ($[0]) {
                                                    case 'generated': return p_.ss($, ($) => p_.literal.not_set())
                                                    case 'manual': return p_.ss($, ($) => p_.literal.not_set())
                                                    default: return p_.au($[0])
                                                }
                                            }))
                                            case 'directory': return p_.ss($, ($) => p_.literal.set($p.name))
                                            default: return p_.au($[0])
                                        }
                                    })
                                })])
                                case 'directory': return p_.ss($, ($): d_out.Node => {
                                    //found a directory in the filesystem, check expected structure
                                    const dir = $
                                    return ['directory', p_.from.state($p['expected structure']).decide(($): d_out.Directory => {
                                        switch ($[0]) {
                                            case 'file': return p_.ss($, ($) => ['expected a file', null])
                                            case 'directory': return p_.ss($, ($) => Directory(
                                                dir,
                                                {
                                                    'expected structure': $,
                                                    'structure path': $p['structure path'],
                                                }
                                            ))
                                            default: return p_.au($[0])
                                        }
                                    })]
                                })
                                case 'other': return p_.ss($, ($) => ['other', null])
                                default: return p_.au($[0])
                            }
                        })
                        return expected.__get_possible_entry_deprecated(id).__decide(
                            ($) => NodeX(
                                node,
                                {
                                    'name': id,
                                    'expected structure': $,
                                    'structure path': `${$p['structure path']}/${id}`,
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
                                    'unexpected path tail': p_.literal.set(`/${id}`),
                                }
                            )
                        )
                    })]
                })
                case 'ignore': return p_.ss($, ($) => ['ignored', null])
                case 'generated': return p_.ss($, ($) => undefined.Directory(
                    dir,
                    {
                        'structure': {
                            'classification': ['directory', ['generated', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': p_.literal.not_set(),
                    }
                ))
                case 'wildcards': return p_.ss($, ($) => wildcard.Directory(
                    dir,
                    {
                        'wildcard': $,
                        'structure path': $p['structure path'],
                        'tail': "",
                        'number of directories encountered': 0,
                    }
                ))
                case 'freeform': return p_.ss($, ($) => undefined.Directory(
                    dir,
                    {
                        'structure': {
                            'classification': ['directory', ['freeform', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': p_.literal.not_set(),
                    }
                ))
                case 'dictionary': return p_.ss($, ($) => {
                    //expecting a dictionary of directories
                    const struct = $

                    return ['dictionary', dir.__d_map_deprecated(($, id): d_out.Node => p_.from.state($).decide(($): d_out.Node => {
                        switch ($[0]) {
                            case 'directory': return p_.ss($, ($) => ['directory', Directory(
                                $,
                                {
                                    'expected structure': struct,
                                    'structure path': `${$p['structure path']}/*`,
                                }
                            )])
                            case 'other': return p_.ss($, ($) => ['other', null])
                            case 'file': return p_.ss($, ($): d_out.Node => ['file', {
                                'structure': {
                                    'path': `${$p['structure path']}/*`,
                                    'classification': ['directory', ['dictionary', null]],
                                },
                                'extension': extension(id),
                                'line count': line_count($),
                                'unexpected path tail': p_.literal.set(`/${id}`),
                            }])
                            default: return p_.au($[0])
                        }
                    }))]
                })
                default: return p_.au($[0])
            }
        })
    }

}

export namespace undefined {

    export const Directory: interface_.undefined.Directory = ($, $p) => {
        return ['dictionary', $.__d_map_deprecated(($, id) => Node(
            $,
            {
                'name': id,
                'structure': $p.structure,
                'unexpected path tail': p_.from.optional($p['unexpected path tail']).map(($) => $ + "/" + id),
            }
        ))]
    }

    export const Node: interface_.undefined.Node = ($, $p) => {
        return p_.from.state($).decide(($): d_out.Node => {
            switch ($[0]) {
                case 'file': return p_.ss($, ($): d_out.Node => ['file', {
                    'unexpected path tail': $p['unexpected path tail'],
                    'structure': $p['structure'],
                    'extension': extension($p['name']),
                    'line count': line_count($),
                }])
                case 'directory': return p_.ss($, ($) => {
                    const dir = $
                    return ['directory', Directory(
                        $,
                        {
                            'structure': $p.structure,
                            'unexpected path tail': $p['unexpected path tail'],
                        }
                    )]
                })
                case 'other': return p_.ss($, ($) => ['other', null])
                default: return p_.au($[0])
            }
        })
    }

}

export namespace wildcard {

    export const Directory: interface_.wildcard.Directory = ($, $p) => {
        return ['dictionary', $.__d_map_deprecated(($, id) => {
            const tail = $p.tail + "/" + id
            return p_.from.state($).decide(($): d_out.Node => {
                switch ($[0]) {
                    case 'other': return p_.ss($, ($) => ['other', null])
                    case 'file': return p_.ss($, ($): d_out.Node => ['file', {
                        'structure': {
                            'path': $p['structure path'],
                            'classification': ['directory', ['wildcards', null]],
                        },
                        'extension': extension(id),
                        'unexpected path tail': p_change_context($, ($) => {
                            if ($p['number of directories encountered'] < $p['wildcard']['required directories']) {
                                //files are not allowed yet, haven't descended through enough required directories
                                return p_.literal.set(tail)
                            }
                            if (!$p.wildcard['additional directories allowed'] && $p['number of directories encountered'] > $p['wildcard']['required directories']) {
                                //additional directories are not allowed and we've gone too deep
                                return p_.literal.set(tail)
                            }
                            let extension_matched = false
                            p_.from.optional(extension(id)).map(($) => {
                                const file_extension = $
                                $p['wildcard']['extensions'].__l_map_deprecated(($) => {
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
                    case 'directory': return ['directory', p_.ss($, ($) => {
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
                    default: return p_.au($[0])
                }
            })
        })]
    }


}


