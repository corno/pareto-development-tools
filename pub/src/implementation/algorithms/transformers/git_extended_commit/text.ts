import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d_in from "../../../../interface/temp/git_extended_commit"
import * as t_eqe_to_text from "../execute_query_executable/text"
import * as t_git_is_clean_to_text from "../git_is_clean/text"

export const Error = ($: d_in.Error): string => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'asserting git not clean': return _ea.ss($, ($) => {
            return `error while asserting git is not clean: ${t_git_is_clean_to_text.Error($)}`
        })
        case 'could not stage': return _ea.ss($, ($) => {
            return `could not stage: ${t_eqe_to_text.Error($)}`
        })
        case 'could not commit': return _ea.ss($, ($) => {
            return `could not commit: ${t_eqe_to_text.Error($)}`
        })
        case 'could not push': return _ea.ss($, ($) => {
            return `could not push: ${t_eqe_to_text.Error($)}`
        })
        default: return _ea.au($[0])
    }
})