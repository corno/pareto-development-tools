import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as d_text from "pareto-fountain-pen/dist/interface/to_be_generated/list_of_characters"

export const serialize = ($: d_text.List_of_Characters): string => _p_text_from_list($, ($) => $)
