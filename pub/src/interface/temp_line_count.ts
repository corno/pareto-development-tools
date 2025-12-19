import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'


export type Node =
    | ['other', null]
    | ['file', number]
    | ['directory', Directory]

export type Directory = _et.Dictionary<Node>


export type Flattened_Directory_With_Line_Counts = _et.Dictionary<number>