import * as _p from 'pareto-core/dist/assign'
import _p_variables from 'pareto-core/dist/_p_variables'
import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'
import _p_list_build_deprecated from 'pareto-core/dist/_p_list_build_deprecated'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'

//data types
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"
import * as d_out from "pareto-fountain-pen/dist/interface/to_be_generated/list_of_characters"

const replace = ($: string, search: number, replace: number): d_out.List_of_Characters => _p_list_build_deprecated(($i) => {
    _p_list_from_text($, ($) => $).__l_map(($) => {
        if ($ === search) {
            $i['add item'](replace)
        } else {
            $i['add item']($)
        }
    })
})

export const replace_space_in_context_path = ($: d_path.Node_Path): d_path.Node_Path => {
    const replace_space = ($: string): string => {
        return _p_text_from_list(
            replace($, 32, 95 /* space -> underscore */),
            ($) => $,
        )
    }
    return {
        'context': {
            'start': $.context.start,
            'subpath': $.context.subpath.__l_map(($) => replace_space($)),
        },
        'node': replace_space($.node)
    }
}