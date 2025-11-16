import * as _ea from 'exupery-core-alg'

import * as d_in from "../../../../interface/temp/update_typescript_dependencies"

export const Error = ($: d_in.Error): string => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'could not clean': return _ea.ss($, ($) => `could not clean working directory before updating typescript dependencies: ${_ea.cc($, ($) => {
                switch ($[0]) {
                    case 'unexpected error': return _ea.ss($, ($) => `unexpected error: ${_ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'failed to spawn': return _ea.ss($, ($) => `failed to spawn process: ${$.message}`)
                            case 'non zero exit code': return _ea.ss($, ($) => `non zero exit code: ${$.stderr}`)
                            default: return _ea.au($[0])
                        }
                    })}`)
                    default: return _ea.au($[0])
                }
            })}`)
            case 'could not update to latest': return _ea.ss($, ($) => `could not update to latest dependencies`)
            case 'could not install': return _ea.ss($, ($) => `could not install typescript dependencies, ${_ea.cc($, ($) => {
                switch ($[0]) {
                    case 'error while running npm': return _ea.ss($, ($) => `error while running npm: ${_ea.cc($, ($) => {
                        switch ($[0]) {
                            case 'failed to spawn': return _ea.ss($, ($) => `failed to spawn process: ${$.message}`)
                            case 'non zero exit code': return _ea.ss($, ($) => `non zero exit code: ${$.stderr}`)
                            default: return _ea.au($[0])
                        }
                    })}`)
                    default: return _ea.au($[0])
                }
            })}`)
            default: return _ea.au($[0])
        }
    })
}