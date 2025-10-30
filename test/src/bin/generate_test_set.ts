#!/usr/bin/env -S node

import { $$ as generate_test_set } from "../lib/generate_test_set"

// generate_test_set <path-to-cluster> <test-name>

const args = process.argv.slice(2)

if (args.length !== 3) {
    console.log('Usage: generate_test_set <path-to-cluster> <path-to-test> <test-name>')
    process.exit(1)
}

const [path_to_cluster, path_to_test, test_name] = args

generate_test_set(path_to_cluster, path_to_test, test_name)