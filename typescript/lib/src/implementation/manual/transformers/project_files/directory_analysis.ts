import * as _p from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'
import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'
import _p_list_build_deprecated from 'pareto-core/dist/_p_list_build_deprecated'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

//data types
import * as d_in from "../../../../interface/to_be_generated/project_files"
import * as d_in_directory_content from "pareto-resources/dist/interface/to_be_generated/directory_content"
import * as d_out from "../../../../interface/to_be_generated/file_structure_analysis"
import * as d_structure from "../../../../interface/generated/liana/schemas/structure/data"

//data
import { $$ as x_structure } from "../../../../data/structure"

export type Parameters = {
    'expected structure': d_structure.Directory,
    'structure path': string,
}

export type Project_Files = _pi.Transformer<
    d_in.Project_Files,
    d_out.File_Analysis_List
>


export const Project_Files: Project_Files = ($) => _p.list.from.dictionary(
    $
).flatten(
    ($, id) => {
        const package_name = id
        const Directory2 = ($: d_out.Directory): d_out.Flattened_Directory_With_Line_Counts => {
            const temp: { [id: string]: d_out.File_Analysis } = {}
            const x = ($: d_out.Directory, path: string): void => {
                _p.decide.state($, ($): null => {
                    switch ($[0]) {
                        case 'expected a file': return _p.ss($, ($) => {
                            return null
                        })
                        case 'ignored': return _p.ss($, ($) => {
                            return null
                        })
                        case 'dictionary': return _p.ss($, ($) => {
                            $.__d_map(($, id) => {

                                return _p.decide.state($, ($): null => {
                                    switch ($[0]) {
                                        case 'other': return null //do nothing, ignore other filesystem nodes for now
                                        case 'file': return _p.ss($, ($) => {
                                            temp[`${path}/${id}`] = $
                                            return null
                                        })
                                        case 'directory': return _p.ss($, ($) => {
                                            x($, `${path}/${id}`)
                                            return null
                                        })
                                        default: return _p.au($[0])
                                    }
                                })
                            })
                            return null
                        })
                        default: return _p.au($[0])
                    }
                })

            }
            x($, "")
            return _p.dictionary.literal(temp)
        }
        return _p.list.from.dictionary(
            Directory2(
                defined.Directory(
                    $,
                    {
                        'expected structure': x_structure,
                        'structure path': "",
                    }
                )
            ),
        ).convert(
            ($, id) => ({
                'package': package_name,
                'path': id,
                'analysis': $,
            })
        )
    }
)




const line_count = ($: string): number => {
    let lineCount = 0
    _p_list_from_text($, ($) => $).__l_map(($) => {
        if ($ === 10) { //newline character
            lineCount++
        }
        return null
    })
    return lineCount + 1 //add one for the last line if it doesn't end with a newline
}

const extension = ($: string): _pi.Optional_Value<string> => {
    const characters = _p_list_from_text($, ($) => $)

    let first_period_index: null | number = null
    let current_index = 0
    characters.__l_map(($) => {
        if ($ === 46) { //period
            first_period_index = current_index
        }
        current_index++
        return null
    })
    if (first_period_index === null) {
        return _p.optional.literal.not_set()
    } else {
        const fpi: number = first_period_index
        current_index = 0
        return _p.optional.literal.set(
            _p_text_from_list(
                _p_list_build_deprecated<number>(($i) => {
                    characters.__l_map(($) => {
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

    export const Directory = (
        $: d_in_directory_content.Directory,
        $p: Parameters
    ): d_out.Directory => {
        //both found and expected are directories

        const dir = $
        return _p.decide.state($p['expected structure'], ($): d_out.Directory => {
            switch ($[0]) {

                case 'group': return _p.ss($, ($) => {
                    const expected = $
                    return ['dictionary', dir.__d_map(($, id) => {
                        const node = $
                        const NodeX = (
                            $: d_in_directory_content.Node,
                            $p: {
                                'name': string,
                                'expected structure': d_structure.Directory.group.D,
                                'structure path': string,
                            }
                        ): d_out.Node => _p.decide.state($, ($): d_out.Node => {
                            switch ($[0]) {
                                case 'file': return _p.ss($, ($): d_out.Node => ['file', ({
                                    'structure': {
                                        'path': $p['structure path'],
                                        'classification': _p.decide.state($p['expected structure'], ($): d_out.Classification => {
                                            switch ($[0]) {
                                                case 'file': return _p.ss($, ($) => _p.decide.state($, ($) => {
                                                    switch ($[0]) {
                                                        case 'generated': return _p.ss($, ($) => ['file', ['generated', null]])
                                                        case 'manual': return _p.ss($, ($) => ['file', ['manual', null]])
                                                        default: return _p.au($[0])
                                                    }
                                                }))
                                                case 'directory': return _p.ss($, ($) => ['directory', _p.decide.state($, ($): d_out.Directory_Classification => {
                                                    switch ($[0]) {
                                                        case 'wildcards': return _p.ss($, ($) => ['wildcards', null])
                                                        case 'freeform': return _p.ss($, ($) => ['freeform', null])
                                                        case 'ignore': return _p.ss($, ($) => ['ignored', null])
                                                        case 'generated': return _p.ss($, ($) => ['generated', null])
                                                        case 'dictionary': return _p.ss($, ($) => ['dictionary', null])
                                                        case 'group': return _p.ss($, ($) => ['group', null])
                                                        default: return _p.au($[0])
                                                    }
                                                })])
                                                default: return _p.au($[0])
                                            }
                                        })
                                    },
                                    'extension': extension($p['name']),
                                    'line count': line_count($),
                                    'unexpected path tail': _p.decide.state($p['expected structure'], ($) => {
                                        switch ($[0]) {
                                            case 'file': return _p.ss($, ($) => _p.decide.state($, ($) => {
                                                switch ($[0]) {
                                                    case 'generated': return _p.ss($, ($) => _p.optional.literal.not_set())
                                                    case 'manual': return _p.ss($, ($) => _p.optional.literal.not_set())
                                                    default: return _p.au($[0])
                                                }
                                            }))
                                            case 'directory': return _p.ss($, ($) => _p.optional.literal.set($p.name))
                                            default: return _p.au($[0])
                                        }
                                    })
                                })])
                                case 'directory': return _p.ss($, ($): d_out.Node => {
                                    //found a directory in the filesystem, check expected structure
                                    const dir = $
                                    return ['directory', _p.decide.state($p['expected structure'], ($): d_out.Directory => {
                                        switch ($[0]) {
                                            case 'file': return _p.ss($, ($) => ['expected a file', null])
                                            case 'directory': return _p.ss($, ($) => Directory(
                                                dir,
                                                {
                                                    'expected structure': $,
                                                    'structure path': $p['structure path'],
                                                }
                                            ))
                                            default: return _p.au($[0])
                                        }
                                    })]
                                })
                                case 'other': return _p.ss($, ($) => ['other', null])
                                default: return _p.au($[0])
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
                                    'unexpected path tail': _p.optional.literal.set(`/${id}`),
                                }
                            )
                        )
                    })]
                })
                case 'ignore': return _p.ss($, ($) => ['ignored', null])
                case 'generated': return _p.ss($, ($) => undefined.Directory(
                    dir,
                    {
                        'structure': {
                            'classification': ['directory', ['generated', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': _p.optional.literal.not_set(),
                    }
                ))
                case 'wildcards': return _p.ss($, ($) => wildcard.Directory(
                    dir,
                    {
                        'wildcard': $,
                        'structure path': $p['structure path'],
                        'tail': "",
                        'number of directories encountered': 0,
                    }
                ))
                case 'freeform': return _p.ss($, ($) => undefined.Directory(
                    dir,
                    {
                        'structure': {
                            'classification': ['directory', ['freeform', null]],
                            'path': $p['structure path'],
                        },
                        'unexpected path tail': _p.optional.literal.not_set(),
                    }
                ))
                case 'dictionary': return _p.ss($, ($) => {
                    //expecting a dictionary of directories
                    const struct = $

                    return ['dictionary', dir.__d_map(($, id): d_out.Node => _p.decide.state($, ($): d_out.Node => {
                        switch ($[0]) {
                            case 'directory': return _p.ss($, ($) => ['directory', Directory(
                                $,
                                {
                                    'expected structure': struct,
                                    'structure path': `${$p['structure path']}/*`,
                                }
                            )])
                            case 'other': return _p.ss($, ($) => ['other', null])
                            case 'file': return _p.ss($, ($): d_out.Node => ['file', {
                                'structure': {
                                    'path': `${$p['structure path']}/*`,
                                    'classification': ['directory', ['dictionary', null]],
                                },
                                'extension': extension(id),
                                'line count': line_count($),
                                'unexpected path tail': _p.optional.literal.set(`/${id}`),
                            }])
                            default: return _p.au($[0])
                        }
                    }))]
                })
                default: return _p.au($[0])
            }
        })
    }

}

export namespace undefined {

    export const Directory = (
        $: d_in_directory_content.Directory,
        $p: {
            'structure': d_out.Structure_Analysis,
            'unexpected path tail': _pi.Optional_Value<string>,
        }
    ): d_out.Directory => {
        return ['dictionary', $.__d_map(($, id) => Node(
            $,
            {
                'name': id,
                'structure': $p.structure,
                'unexpected path tail': _p.optional.from.optional($p['unexpected path tail']).map(($) => $ + "/" + id),
            }
        ))]
    }

    export const Node = (
        $: d_in_directory_content.Node,
        $p: {
            'structure': d_out.Structure_Analysis,
            'name': string,
            'unexpected path tail': _pi.Optional_Value<string>,
        }
    ): d_out.Node => {
        return _p.decide.state($, ($): d_out.Node => {
            switch ($[0]) {
                case 'file': return _p.ss($, ($): d_out.Node => ['file', {
                    'unexpected path tail': $p['unexpected path tail'],
                    'structure': $p['structure'],
                    'extension': extension($p['name']),
                    'line count': line_count($),
                }])
                case 'directory': return _p.ss($, ($) => {
                    const dir = $
                    return ['directory', Directory(
                        $,
                        {
                            'structure': $p.structure,
                            'unexpected path tail': $p['unexpected path tail'],
                        }
                    )]
                })
                case 'other': return _p.ss($, ($) => ['other', null])
                default: return _p.au($[0])
            }
        })
    }

}

export namespace wildcard {

    export const Directory = (
        $: d_in_directory_content.Directory,
        $p: {
            'wildcard': d_structure.Directory.wildcards,
            'structure path': string,
            'tail': string,
            'number of directories encountered': number,
        }
    ): d_out.Directory => {
        return ['dictionary', $.__d_map(($, id) => {
            const tail = $p.tail + "/" + id
            return _p.decide.state($, ($): d_out.Node => {
                switch ($[0]) {
                    case 'other': return _p.ss($, ($) => ['other', null])
                    case 'file': return _p.ss($, ($): d_out.Node => ['file', {
                        'structure': {
                            'path': $p['structure path'],
                            'classification': ['directory', ['wildcards', null]],
                        },
                        'extension': extension(id),
                        'unexpected path tail': _p.optional.block(() => {
                            if ($p['number of directories encountered'] < $p['wildcard']['required directories']) {
                                //files are not allowed yet, haven't descended through enough required directories
                                return _p.optional.literal.set(tail)
                            }
                            if (!$p.wildcard['additional directories allowed'] && $p['number of directories encountered'] > $p['wildcard']['required directories']) {
                                //additional directories are not allowed and we've gone too deep
                                return _p.optional.literal.set(tail)
                            }
                            const possible_file_extension = extension(id)
                            let extension_matched = false
                            _p.optional.from.optional(possible_file_extension).map(($) => {
                                const file_extension = $
                                $p['wildcard']['extensions'].__l_map(($) => {
                                    if ($ === file_extension) {
                                        extension_matched = true
                                    }
                                    return null
                                })
                                return null
                            })
                            return extension_matched
                                ? _p.optional.literal.not_set()
                                : _p.optional.literal.set(tail)

                        }),
                        'line count': line_count($),
                    }])
                    case 'directory': return ['directory', _p.ss($, ($) => {
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
                    default: return _p.au($[0])
                }
            })
        })]
    }


}


