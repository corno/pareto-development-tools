import * as _ea from 'exupery-core-alg'

import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

export const Error = ($: d_eqe.Error): string => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'failed to spawn': return _ea.ss($, ($) => {
                return `failed to spawn process: ${$.message}`
            })
            case 'non zero exit code': return _ea.ss($, ($) => {
                return `non zero exit code: ${$['exit code'].transform(($) => `` + $, () => `-`)}>${$.stderr}`
            })
            default: return _ea.au($[0])
        }
    })
}