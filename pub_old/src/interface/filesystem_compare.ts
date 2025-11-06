
 export type Directory_Diff = { [name: string]: Node_Diff }


export type Node_Diff =
    | ['error',
        | ['missing', null]
        | ['superfluous', null]
        | ['not a directory', null]
        | ['not a file', null]
    ]
    | ['success', 
        | ['file', null]
        | ['directory', Directory_Diff]
    ]