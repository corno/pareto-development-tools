import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

export type Directory =
    | ['ignored', null]
    | ['dictionary', _et.Dictionary<Node>]
    | ['expected a file', null]


export type Node =
    | ['other', null]
    | ['file', File_Analysis]
    | ['directory', Directory]

export type Classification =
    | ['directory', Directory_Classification]
    | ['file', File_Classification]

export type Directory_Classification =
    | ['ignored', null]
    | ['freeform', null]
    | ['generated', null]
    | ['wildcards', null]
    | ['group', null]
    | ['dictionary', null]

export type File_Classification =
    | ['manual', null]
    | ['generated', null]

export type File_Analysis = {
    'structure': Structure_Analysis,
    'extension': _et.Optional_Value<string>,
    'unexpected path tail': _et.Optional_Value<string>,
    'line count': number,
}

export type Structure_Analysis = {
    'path': string
    'classification': Classification
}

export type Flattened_Directory_With_Line_Counts = _et.Dictionary<File_Analysis>