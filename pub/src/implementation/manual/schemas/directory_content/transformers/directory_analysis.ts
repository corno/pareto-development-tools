import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pds from 'pareto-core-deserializer'
import * as _pinternals from 'pareto-core-internals'

import * as d_in from "pareto-resources/dist/interface/to_be_generated/directory_content"
import * as d_out from "../../../../../interface/to_be_generated/temp_directory_analysis"
import * as d_structure from "../../../../../interface/generated/pareto/schemas/structure/data_types/target"

const line_count = ($: string): number => {
    let lineCount = 0
    _pds.text_to_character_list($).__for_each(($) => {
        if ($ === 10) { //newline character
            lineCount++
        }
    })
    return lineCount + 1 //add one for the last line if it doesn't end with a newline
}

const extension = ($: string): _pi.Optional_Value<string> => {
    const characters = _pds.text_to_character_list($)

    let first_period_index: null | number = null
    let current_index = 0
    characters.__for_each(($) => {
        if ($ === 46) { //period
            first_period_index = current_index
        }
        current_index++
    })
    if (first_period_index === null) {
        return _p.not_set()
    } else {
        const fpi: number = first_period_index
        current_index = 0
        return _p.set(_pds.build_text(($i) => {
            characters.__for_each(($) => {
                if (current_index > fpi) {
                    $i['add character']($)
                }
                current_index++
            })
        }))
    }
}

export namespace defined {

    export const Directory = (
        $: d_in.Directory,
        $p: {
            'expected structure': d_structure.Directory,
            'structure path': string,
        }
    ): d_out.Directory => {
        //both found and expected are directories

        const dir = $
        return _p.cc($p['expected structure'], ($): d_out.Directory => {
            switch ($[0]) {

                case 'group': return _p.ss($, ($) => {
                    const expected = $
                    return ['dictionary', dir.map(($, key) => {
                        const node = $
                        const NodeX = (
                            $: d_in.Node,
                            $p: {
                                'name': string,
                                'expected structure': d_structure.Directory.SG.group.D,
                                'structure path': string,
                            }
                        ): d_out.Node => {
                            return _p.cc($, ($): d_out.Node => {
                                switch ($[0]) {
                                    case 'file': return _p.ss($, ($): d_out.Node => ['file', ({
                                        'structure': {
                                            'path': $p['structure path'],
                                            'classification': _p.cc($p['expected structure'], ($): d_out.Classification => {
                                                switch ($[0]) {
                                                    case 'file': return _p.ss($, ($) => _p.cc($, ($) => {
                                                        switch ($[0]) {
                                                            case 'generated': return _p.ss($, ($) => ['file', ['generated', null]])
                                                            case 'manual': return _p.ss($, ($) => ['file', ['manual', null]])
                                                            default: return _p.au($[0])
                                                        }
                                                    }))
                                                    case 'directory': return _p.ss($, ($) => ['directory', _p.cc($, ($): d_out.Directory_Classification => {
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
                                        'unexpected path tail': _p.cc($p['expected structure'], ($) => {
                                            switch ($[0]) {
                                                case 'file': return _p.ss($, ($) => _p.cc($, ($) => {
                                                    switch ($[0]) {
                                                        case 'generated': return _p.ss($, ($) => _p.not_set())
                                                        case 'manual': return _p.ss($, ($) => _p.not_set())
                                                        default: return _p.au($[0])
                                                    }
                                                }))
                                                case 'directory': return _p.ss($, ($) => _p.set($p.name))
                                                default: return _p.au($[0])
                                            }
                                        })
                                    })])
                                    case 'directory': return _p.ss($, ($): d_out.Node => {
                                        //found a directory in the filesystem, check expected structure
                                        const dir = $
                                        return ['directory', _p.cc($p['expected structure'], ($): d_out.Directory => {
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
                        }
                        return expected.get_entry(key).transform(
                            ($) => NodeX(
                                node,
                                {
                                    'name': key,
                                    'expected structure': $,
                                    'structure path': `${$p['structure path']}/${key}`,
                                }
                            ),
                            () => undefined.Node( //no expected structure for this entry
                                $,
                                {
                                    'name': key,
                                    'structure': {
                                        'classification': ['directory', ['group', null]],
                                        'path': $p['structure path'],
                                    },
                                    'unexpected path tail': _p.set(`/${key}`),
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
                        'unexpected path tail': _p.not_set(),
                    }
                ))
                case 'wildcards': return _p.ss($, ($) => wildcard.Directory(
                    dir,
                    {
                        'wildcard': $,
                        'structure path': $p['structure path'],
                        'tail': ``,
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
                        'unexpected path tail': _p.not_set(),
                    }
                ))
                case 'dictionary': return _p.ss($, ($) => {
                    //expecting a dictionary of directories
                    const struct = $

                    return ['dictionary', dir.map(($, key): d_out.Node => {
                        const node = $
                        return _p.cc($, ($): d_out.Node => {
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
                                    'extension': extension(key),
                                    'line count': line_count($),
                                    'unexpected path tail': _p.set(`/${key}`),
                                }])
                                default: return _p.au($[0])
                            }
                        })
                    })]
                })
                default: return _p.au($[0])
            }
        })
    }

}

export namespace undefined {

    export const Directory = (
        $: d_in.Directory,
        $p: {
            'structure': d_out.Structure_Analysis,
            'unexpected path tail': _pi.Optional_Value<string>,
        }
    ): d_out.Directory => {
        return ['dictionary', $.map(($, key) => Node(
            $,
            {
                'name': key,
                'structure': $p.structure,
                'unexpected path tail': $p['unexpected path tail'].map(($) => $ + `/${key}`),
            }
        ))]
    }

    export const Node = (
        $: d_in.Node,
        $p: {
            'structure': d_out.Structure_Analysis,
            'name': string,
            'unexpected path tail': _pi.Optional_Value<string>,
        }
    ): d_out.Node => {
        return _p.cc($, ($): d_out.Node => {
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
        $: d_in.Directory,
        $p: {
            'wildcard': d_structure.Directory.SG.wildcards,
            'structure path': string,
            'tail': string,
            'number of directories encountered': number,
        }
    ): d_out.Directory => {
        return ['dictionary', $.map(($, key) => {
            const tail = $p.tail + `/${key}`
            return _p.cc($, ($): d_out.Node => {
                switch ($[0]) {
                    case 'other': return _p.ss($, ($) => ['other', null])
                    case 'file': return _p.ss($, ($): d_out.Node => ['file', {
                        'structure': {
                            'path': $p['structure path'],
                            'classification': ['directory', ['wildcards', null]],
                        },
                        'extension': extension(key),
                        'unexpected path tail': _pinternals.block(() => {
                            if ($p['number of directories encountered'] < $p['wildcard']['required directories']) {
                                //files are not allowed yet, haven't descended through enough required directories
                                return _p.set(tail)
                            }
                            if (!$p.wildcard['additional directories allowed'] && $p['number of directories encountered'] > $p['wildcard']['required directories']) {
                                //additional directories are not allowed and we've gone too deep
                                return _p.set(tail)
                            }
                            const possible_file_extension = extension(key)
                            let extension_matched = false
                            possible_file_extension.map(($) => {
                                const file_extension = $
                                $p['wildcard']['extensions'].__for_each(($) => {
                                    if ($ === file_extension) {
                                        extension_matched = true
                                    }
                                })

                            })
                            return extension_matched
                                ? _p.not_set()
                                : _p.set(tail)

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



export const Directory2 = ($: d_out.Directory): d_out.Flattened_Directory_With_Line_Counts => {
    const temp: { [key: string]: d_out.File_Analysis } = {}
    const x = ($: d_out.Directory, path: string): void => {
        _p.cc($, ($) => {
            switch ($[0]) {
                case 'expected a file': return _p.ss($, ($) => { })
                case 'ignored': return _p.ss($, ($) => { })
                case 'dictionary': return _p.ss($, ($) => {
                    $.map(($, key) => {

                        _p.cc($, ($) => {
                            switch ($[0]) {
                                case 'other': return //do nothing, ignore other filesystem nodes for now
                                case 'file': return _p.ss($, ($) => temp[`${path}/${key}`] = $)
                                case 'directory': return _p.ss($, ($) => x($, `${path}/${key}`))
                                default: return _p.au($[0])
                            }
                        })
                    })
                })
                default: return _p.au($[0])
            }
        })

    }
    x($, ``)
    return _p.dictionary_literal(temp)
}


export const dict_to_list = ($: d_out.Flattened_Directory_With_Line_Counts): _pi.List<{
    'path': string,
    'analysis': d_out.File_Analysis,
}> => {
    return $.to_list(($, key) => ({
        'path': key,
        'analysis': $,
    }))
}