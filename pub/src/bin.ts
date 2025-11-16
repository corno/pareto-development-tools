#!/usr/bin/env -S node --enable-source-maps

import * as _eb from 'exupery-core-bin'

import * as d_bin from "./implementation/algorithms/procedures/unguaranteed/bin"

import { $$ as p_bin } from "./implementation/algorithms/procedures/unguaranteed/bin"

_eb.run_unguaranteed_main_procedure<d_bin.Resources>(
    ($rr) => {
        return {
            'queries': {
                'git': ($p) => {
                    return $rr.queries['execute any query executable'](
                        {
                            'program': `git`,
                            'args': $p.args,
                        },
                    )
                },
                'read directory': ($p) => {
                    return $rr.queries['read directory']($p)
                },
            },
            'procedures': {
                'git': ($p) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `git`,
                            'args': $p.args,
                        },
                    )
                },
                'log': ($p) => {
                    return $rr.procedures.log(
                        $p,
                    )
                },
                'npm': ($p) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `npm`,
                            'args': $p.args,
                        },
                    )
                },
                'node': ($p) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `node`,
                            'args': $p.args,
                        },
                    )
                },
                'tsc': ($p) => {
                    return $rr.procedures['execute any smelly procedure executable'](
                        {
                            'program': `tsc`,
                            'args': $p.args,
                        },
                    )
                },
                'update2latest': ($p) => {
                    return $rr.procedures['execute any procedure executable'](
                        {
                            'program': `update2latest`,
                            'args': $p.args,
                        },
                    )
                },
                'write to stderr': ($p) => {
                    return $rr.procedures['write to stderr']($p)
                },
            },
        }
    },
    ($p) => {
        return p_bin($p)
    }
)
