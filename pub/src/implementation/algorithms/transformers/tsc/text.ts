import * as _ea from 'exupery-core-alg'

import * as d_in from "../../../../interface/temp/tsc"

export const Error = ($: d_in.Error): string => {
    return _ea.cc($, ($): string => {
        switch ($[0]) {
            case 'error while running tsc': return _ea.ss($, ($) => {
                return _ea.cc($, ($) => {
                    switch ($[0]) {
                        case 'failed to spawn': return _ea.ss($, ($): string => {
                            return `failed to spawn`
                        })
                        case 'non zero exit code': return _ea.ss($, ($) => {
                            return $.stderr + $.stdout
                        })
                        default: return _ea.au($[0])
                    }
                })
            })
            default: return _ea.au($[0])
        }
    })
}