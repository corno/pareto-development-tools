import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as d_text from "pareto-fountain-pen/dist/interface/to_be_generated/text"

export namespace b {

    export const text = ($: d_text.Text): string => _p_text_from_list($, ($) => $)

    export const literal = ($: string) => $

}