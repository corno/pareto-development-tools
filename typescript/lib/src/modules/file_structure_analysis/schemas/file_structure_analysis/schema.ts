import * as p_ from 'pareto-core/schema'

import * as s_path from "../path/schema.js"
import * as s_loc from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/list_of_characters/schema"

export type Directory =
    | ['ignored', null]
    | ['wildcard', p_.Dictionary<Node>]
    | ['defined', p_.Dictionary<Node>]
    | ['undefined', p_.Dictionary<Node>]
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
    'content': s_loc.List_Of_Characters
    'structure': Structure_Analysis
    'extension': p_.Optional_Value<string>
    'unexpected path tail': p_.Optional_Value<s_path.Path>
}

export type Structure_Analysis = {
    'path': s_path.Path
    'classification': Classification
}

export type Analyzed_Node =
    | ['file', File_Analysis]
    | ['unexpected directory', null]
    | ['other', null]

export type Flattened_Tree = p_.Dictionary<Analyzed_Node>