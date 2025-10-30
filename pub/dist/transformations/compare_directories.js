"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare_directories = void 0;
const compare_directories = (benchmark, focus) => {
    const result = {};
    for (const [name, node] of Object.entries(focus)) {
        const benchmark_node = benchmark[name];
        if (!benchmark_node) {
            result[name] = ['error', ['superfluous', null]];
            continue;
        }
        if (node[0] !== benchmark_node[0]) {
            if (node[0] === 'file') {
                result[name] = ['error', ['not a directory', null]];
            }
            else {
                result[name] = ['error', ['not a file', null]];
            }
            continue;
        }
        if (node[0] === 'directory') {
            result[name] = ['success', ['directory', (0, exports.compare_directories)(benchmark_node[1], node[1])]];
        }
        else {
            result[name] = ['success', ['file', null]];
        }
    }
    for (const [name, node] of Object.entries(benchmark)) {
        if (!focus[name]) {
            result[name] = ['error', ['missing', null]];
        }
    }
    return result;
};
exports.compare_directories = compare_directories;
