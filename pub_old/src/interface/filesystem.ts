

export type Directory = { [name: string]: Node }

export type Node =
 | ['file', null]
 | ['directory', Directory]
