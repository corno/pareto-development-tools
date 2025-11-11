#!/usr/bin/env -S node --enable-source-maps

import * as _eb from 'exupery-core-bin'

import { $$ as p_bin } from "./implementation/algorithms/procedures/unguaranteed/bin"

import { $$ as q_eaqe } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/execute_any_query_executable"
import { $$ as q_read_directory } from "exupery-resources/dist/implementation/algorithms/queries/unguaranteed/read_directory"

import { $$ as p_eape } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_any_procedure_executable"
import { $$ as p_easpe } from "exupery-resources/dist/implementation/algorithms/procedures/unguaranteed/execute_any_smelly_procedure_executable"
import { $$ as p_log } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/log"
import { $$ as p_write_to_stderr } from "exupery-resources/dist/implementation/algorithms/procedures/guaranteed/write_to_stderr"


_eb.run_unguaranteed_main_procedure(($p, $r) => {
    return p_bin($p, {
        'queries': {
            'git': ($p, $r) => {
                return q_eaqe(
                    {
                        'program': `git`,
                        'args': $p.args,
                    },
                    null
                )
            },
            'read directory': ($p, $r) => {
                return q_read_directory($p, null)
            },
        },
        'procedures': {
            'git': ($p, $r) => {
                return p_eape(
                    {
                        'program': `git`,
                        'args': $p.args,
                    },
                    null
                )
            },
            'npm': ($p, $r) => {
                return p_eape(
                    {
                        'program': `npm`,
                        'args': $p.args,
                    },
                    null
                )
            },
            'tsc': ($p, $r) => {
                return p_easpe(
                    {
                        'program': `tsc`,
                        'args': $p.args,
                    },
                    null
                )
            },
            'update2latest': ($p, $r) => {
                return p_eape(
                    {
                        'program': `update2latest`,
                        'args': $p.args,
                    },
                    null
                )
            },
            'log': ($p, $r) => {
                return p_log(
                    $p,
                    null
                )
            },
            'write to stderr': ($p, $r) => {
                return p_write_to_stderr($p, null)
            },
        },
    })
})
