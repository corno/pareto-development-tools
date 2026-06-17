import * as p_ from 'pareto-core/dist/interface/data'

export type Directory =
    | ['ignored', null]
    | ['dictionary', p_.Dictionary<Node>]
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
    'extension': p_.Optional_Value<string>,
    'unexpected path tail': p_.Optional_Value<string>,
    'line count': number,
}

export type Structure_Analysis = {
    'path': string
    'classification': Classification
}

export type Flattened_Directory_With_Line_Counts = p_.Dictionary<File_Analysis>

export type File_Analysis_List = p_.List<File_Analysis2>

export type File_Analysis2 = {
    'package': string,
    'path': string,
    'analysis': File_Analysis,
}