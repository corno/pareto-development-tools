import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d_in from "../../../../interface/temp/build"
import * as t_eqe_to_text from "../execute_query_executable/text"
import * as t_git_is_clean_to_text from "../git_is_clean/text"
import * as t_build_to_text from "../build/text"
import * as t_tsc_to_string from "../tsc/text"

export const Error = ($: d_in.Error): string => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error building pub': return _ea.ss($, ($) => `could not build pub: ${t_tsc_to_string.Error($)}`)
        case 'error building test': return _ea.ss($, ($) => `could not build test: ${t_tsc_to_string.Error($)}`)
        default: return _ea.au($[0])
    }
})