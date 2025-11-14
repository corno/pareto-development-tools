import * as _ea from 'exupery-core-alg'
import * as _ed from 'exupery-core-dev'

import * as d_in from "../../../../interface/temp/git_remove_tracked_but_ignored"

import * as t_git_extended_commit_to_text from "../git_extended_commit/text"
import * as t_git_is_clean_to_text from "../git_is_clean/text"
import * as t_eqe_to_text from "../execute_query_executable/text"

export const Error = ($: d_in.Error) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'not clean': return _ea.ss($, ($) => {
            _ed.log_debug_message(`not clean`, () => { })
        })
        case 'unexpected error': return _ea.ss($, ($) => {
            _ed.log_debug_message(`${t_git_is_clean_to_text.Error($)}`, () => { })
        })
        case 'could not remove': return _ea.ss($, ($) => {
            _ed.log_debug_message(`could not remove: ${t_eqe_to_text.Error($)}`, () => { })
        })
        case 'could not add': return _ea.ss($, ($) => {
            _ed.log_debug_message(`could not add: ${t_eqe_to_text.Error($)}`, () => { })
        })
        default: return _ea.au($[0])
    }
})