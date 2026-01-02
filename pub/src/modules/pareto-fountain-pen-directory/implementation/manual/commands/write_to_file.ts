
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _p from 'pareto-core-command'

import * as signatures from "../../../interface/signatures"

//data types
import * as d_write_to_file from "../../../interface/to_be_generated/write_to_file"

//dependencies
import * as t_block_2_lines from "pareto-fountain-pen/dist/implementation/manual/schemas/block/transformers/lines"
import { $$ as s_list_of_texts } from "pareto-standard-operations/dist/implementation/temp_serializers/schemas/list_of_texts"
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import { replace_space_in_context_path } from "../schemas/path/transformers/path"

export const $$: signatures.commands.write_to_file = _p.create_command_procedure(
    ($p, $cr) => [
        $cr['make directory'].execute(
            $p['directory path'],
            ($): d_write_to_file.Error => ['make directory', $],
        ),
        $cr['write file'].execute(
            {
                'path': _pt.cc(
                    t_path_to_path.extend_node_path($p['directory path'], { 'addition': $p.filename }),
                    ($) => $p['escape spaces in path']
                        ? replace_space_in_context_path($)
                        : $,
                ),
                'data': s_list_of_texts(
                    t_block_2_lines.Group($p.group, { 'indentation': $p.indentation }).map(($) => $ + $p.newline),
                ),
            },
            ($) => ['write file', $],
        )
    ]
)