
import * as _pt from 'pareto-core/dist/transformer'
import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/command'
import * as _p_ser from 'pareto-core/dist/serializer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d_write_to_file from "../../../interface/to_be_generated/write_to_file"

//dependencies
import * as t_block_2_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import { replace_space_in_context_path } from "../schemas/path/transformers/path"

const s_list_of_texts: _pi.Serializer<_pi.List<string>> = ($) => _p_ser.text.deprecated_build(($i) => {
    $.__for_each(($) => {
        $i['add snippet']($)
    })
})

export const $$: signatures.commands.write_to_file = _p.command_procedure(
    ($p, $cr) => [
        $cr['make directory'].execute(
            $p['directory path'],
            ($): d_write_to_file.Error => ['make directory', $],
        ),
        $cr['write file'].execute(
            {
                'path': _pt.deprecated_cc(
                    t_path_to_path.extend_node_path($p['directory path'], { 'addition': $p.filename }),
                    ($) => $p['escape spaces in path']
                        ? replace_space_in_context_path($)
                        : $,
                ),
                'data': s_list_of_texts(
                    t_block_2_lines.Group($p.group, { 'indentation': $p.indentation }).__l_map(($) => $ + $p.newline),
                ),
            },
            ($) => ['write file', $],
        )
    ]
)