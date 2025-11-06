#!/usr/bin/env node
import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

import { run_tests } from "pareto-test/dist/run_tests"
import { tests } from '../tests'

//check for flag --overwrite-expected
const overwriteExpected = process.argv.includes('--overwrite-expected');

run_tests(
    tests,
    overwriteExpected,
    "./data/test"
)