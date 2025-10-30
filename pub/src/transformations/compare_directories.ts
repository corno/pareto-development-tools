import * as d_in from "../interface/filesystem"
import * as d_out from "../interface/filesystem_compare"


export const compare_directories = (benchmark: d_in.Directory, focus: d_in.Directory): d_out.Directory_Diff => {
    const result: d_out.Directory_Diff = {}

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