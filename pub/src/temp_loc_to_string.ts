import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

import * as d_text from "pareto-fountain-pen/dist/interface/generated/liana/schemas/list_of_characters/data"

export const serialize = ($: d_text.List_of_Characters): string => _p_text_from_list($, ($) => $)
