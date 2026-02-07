
import * as _pt from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'
import * as _p from 'pareto-core/dist/command'
import _p_change_context from 'pareto-core/dist/_p_change_context'
import _p_text_from_list from 'pareto-core/dist/_p_text_from_list'
import _p_list_from_text from 'pareto-core/dist/_p_list_from_text'

import * as signatures from "../../../interface/signatures"

//data types
import * as d_write_to_file from "../../../interface/to_be_generated/write_to_file"

//dependencies
import * as t_block_2_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import { replace_space_in_context_path } from "../schemas/path/transformers/path"

export const $$: signatures.commands.write_to_file = _p.command_procedure(
    ($p, $cr) => [
        $cr['make directory'].execute(
            $p['directory path'],
            ($): d_write_to_file.Error => ['make directory', $],
        ),
        $cr['write file'].execute(
            {
                'path': _p_change_context(
                    t_path_to_path.extend_node_path($p['directory path'], { 'addition': $p.filename }),
                    ($) => $p['escape spaces in path']
                        ? replace_space_in_context_path($)
                        : $,
                ),
                'data': _pt.list.from.list(
                    t_block_2_lines.Paragraph($p.paragraph, { 'indentation': $p.indentation }).__l_map(($) => $ + $p.newline),
                ).flatten(
                    ($) => _p_list_from_text($, ($) => $),
                )
            },
            ($) => ['write file', $],
        )
    ]
)