import * as _ea from 'exupery-core-alg'

import * as d_in from "../../../../interface/temp/git_is_clean"

import * as t_eqe_to_text from "../execute_query_executable/text"


export const Error = ($: d_in.Error): string => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'not a git repository': return _ea.ss($, ($) => `not a git rep`)
        case 'could not determine git status': return _ea.ss($, ($) => `could not determine status, ${t_eqe_to_text.Error($)}`)
        case 'unknown issue': return _ea.ss($, ($) => `unknown issue: ${_ea.cc($, ($) => {
            switch ($[0]) {
                case 'could not run git command': return _ea.ss($, ($) => `could not run git command: ${$.message}`)
                case 'unexpected output': return _ea.ss($, ($) => `unexpected output: ${$}`)
                default: return _ea.au($[0])
            }
        })}`)
        default: return _ea.au($[0])
    }
})