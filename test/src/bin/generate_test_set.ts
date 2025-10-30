#!/usr/bin/env -S node

import { $$ as generate_test_set } from "../lib/generate_test_set"

// generate_test_set <path-to-cluster> <test-name> [--bt] [--cp]

const args = process.argv.slice(2)

let build_and_test = false
let compare_to_published = false
const positional_args: string[] = []

for (const arg of args) {
    if (arg === '--bt') {
        build_and_test = true
    } else if (arg === '--cp') {
        compare_to_published = true
    } else {
        positional_args.push(arg)
    }
}

if (positional_args.length !== 3) {
    console.log('Usage: generate_test_set <path-to-cluster> <path-to-test> <test-name> [--bt] [--cp]')
    process.exit(1)
}

const [path_to_cluster, path_to_test, test_name] = positional_args

generate_test_set({
    'analyse parameters': {
        'cluster path': path_to_cluster,
        'build and test': build_and_test,
        'compare to published': compare_to_published,
    },
    'path to test': path_to_test,
    'test name': test_name,
})