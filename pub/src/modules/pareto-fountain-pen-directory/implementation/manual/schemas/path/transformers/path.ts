import * as _p from 'pareto-core-transformer'
import * as _pds from 'pareto-core-deserializer'


import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data"

const replace = ($: string, search: number, replace: number): string => _pds.text.deprecated_build(($i) => {
    _pds.list.from_text($, ($) => $).__for_each(($) => {
        if ($ === search) {
            $i['add character'](replace)
        } else {
            $i['add character']($)
        }
    })
})

export const replace_space_in_context_path = ($: d_path.Node_Path): d_path.Node_Path => {
    const replace_space = ($: string): string => {
        return replace($, 32, 95 /* space -> underscore */)
    }
    return {
        'context': {
            'start': $.context.start,
            'subpath': $.context.subpath.__l_map(($) => replace_space($)),
        },
        'node': replace_space($.node)
    }
}