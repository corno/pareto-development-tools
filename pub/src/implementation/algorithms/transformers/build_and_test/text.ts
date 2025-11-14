import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d_in from "../../../../interface/temp/build_and_test"
import * as t_eqe_to_text from "../execute_query_executable/text"
import * as t_build_to_text from "../build/text"

export const Error = ($: d_in.Error): string => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'error building': return _ea.ss($, ($) => `error building: ${t_build_to_text.Error($)}`)
        case 'error testing': return _ea.ss($, ($) => `error testing: ${t_eqe_to_text.Error($)}`)
        default: return _ea.au($[0])
    }
})