#!/usr/bin/env -S node --enable-source-maps

import * as _eb from 'exupery-core-bin'

import * as d_bin from "./implementation/algorithms/procedures/unguaranteed/bin"

import { $$ as p_bin } from "./implementation/algorithms/procedures/unguaranteed/bin"

_eb.run_unguaranteed_main_procedure<d_bin.Resources>(
    ($rr) => {
        return {
            'queries': {
                'git': ($p, $r) => {
                    return $rr.queries['execute any query executable'](
                        {
                            'program': `git`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'read directory': ($p, $r) => {
                    return $rr.queries['read directory']($p, null)
                },
            },
            'procedures': {
                'git': ($p, $r) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `git`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'log': ($p, $r) => {
                    return $rr.procedures.log(
                        $p,
                        null
                    )
                },
                'npm': ($p, $r) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `npm`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'node': ($p, $r) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `node`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'tsc': ($p, $r) => {
                    return $rr.procedures['execute any smelly procedure executable'](
                        {
                            'program': `tsc`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'update2latest': ($p, $r) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `update2latest`,
                            'args': $p.args,
                        },
                        null
                    )
                },
                'write to stderr': ($p, $r) => {
                    return $rr.procedures['write to stderr']($p, null)
                },
            },
        }
    },
    ($p, $r) => {
        return p_bin($p, $r)
    }
)
