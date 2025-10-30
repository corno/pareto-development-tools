import * as gdt from "../queries/get_directory_tree"

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

export const compare_directories = (benchmark: gdt.Directory, focus: gdt.Directory): Directory_Diff => {
    const result: Directory_Diff = {}

    for (const [name, node] of Object.entries(focus)) {
        const benchmark_node = benchmark[name]

        if (!benchmark_node) {
            result[name] = ['error', ['superfluous', null]]
            continue
        }

        if (node[0] !== benchmark_node[0]) {
            if (node[0] === 'file') {
                result[name] = ['error', ['not a directory', null]]
            } else {
                result[name] = ['error', ['not a file', null]]
            }
            continue
        }

        if (node[0] === 'directory') {
            result[name] = ['success', ['directory', compare_directories(benchmark_node[1], node[1])]]
        } else {
            result[name] = ['success', ['file', null]]
        }
    }

    for (const [name, node] of Object.entries(benchmark)) {
        if (!focus[name]) {
            result[name] = ['error', ['missing', null]]
        }
    }

    return result
}