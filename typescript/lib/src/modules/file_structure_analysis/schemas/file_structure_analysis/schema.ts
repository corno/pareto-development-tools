import * as p_ from 'pareto-core/interface/schema'

import * as s_path from "../path/schema.js"

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
    'unexpected path tail': p_.Optional_Value<s_path.Path>,
    'line count': number,
}

export type Structure_Analysis = {
    'path': s_path.Path,
    'classification': Classification
}

export type Package_File_Analysis_List = p_.List<Package_File_Analysis>

export type Package_File_Analysis = {
    'path': string,
    'analysis': File_Analysis,
}