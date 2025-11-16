import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../interface/temp/queries/git_is_inside_work_tree"

import { $$ as op_flatten } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/list/flatten"

export const $$: d.Query = _easync.create_query_procedure(($r, $p) => {
    return $r.git(
        {
            'args': op_flatten(_ea.array_literal([
                $p.path.transform(
                    ($) => _ea.array_literal([
                        `-C`,
                        $,
                    ]),
                    () => _ea.array_literal([])
                ),
                _ea.array_literal([
                    `rev-parse`,
                    `--is-inside-work-tree`,
                ])
            ])),
        },
    ).process({
        'result': ($) => {
            if ($.stdout === `true`) {
                return _ea.create_process_result(true)
            } else {
                return _ea.create_process_error<boolean, d.Error>(['unexpected output', $.stdout])
            }
        },
        'error': ($) => _ea.cc($, ($) => {
            switch ($[0]) {
                case 'failed to spawn': return _ea.ss($, ($) => {
                    return _ea.create_process_error<boolean, d.Error>( ['could not run git command', {
                        'message': $.message
                    }])
                })
                case 'non zero exit code': return _ea.ss($, ($) => {
                    if ($['exit code'].transform(($) => $ === 128, () => false)) {
                        return _ea.create_process_result(false)
                    } else {
                        return _ea.create_process_error<boolean, d.Error>( ['unexpected output', $.stderr])  
                    }
                })
                default: return _ea.au($[0])
            }
        })
    })
})