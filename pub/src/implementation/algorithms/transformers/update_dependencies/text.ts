import * as _ea from 'exupery-core-alg'

import * as d_in from "../../../../interface/temp/update_dependencies"

import * as t_utd_to_text from "../update_typescript_dependencies/text"

export const Error = ($: d_in.Error) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error updating pub': return _ea.ss($, ($) => `error updating /pub: ${t_utd_to_text.Error($)}\n`)
        case 'error updating test': return _ea.ss($, ($) => `error updating /test: ${t_utd_to_text.Error($)}\n`)
        default: return _ea.au($[0])
    }
})