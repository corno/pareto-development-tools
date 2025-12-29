
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pc from 'pareto-core-command'

import * as signatures from "../../interface/signatures"

//data types
import * as d_write_to_file from "../../interface/to_be_generated/write_to_file"

//dependencies

import * as t_block_2_lines from "pareto-fountain-pen/dist/implementation/transformers/schemas/block/lines"
import { $$ as s_list_of_texts } from "pareto-standard-operations/dist/implementation/serializers/schemas/list_of_texts"
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"

export const $$: signatures.commands.write_to_file = _pc.create_command_procedure(
    ($p, $cr) => [
        _pc.sequence<d_write_to_file.Error>([
            $cr['make directory'].execute(
                $p['directory path'],
                ($) => ['make directory', $],
            ),
            $cr['write file'].execute(
                {
                    'path': t_path_to_path.extend_node_path($p['directory path'], { 'addition': $p.filename }),
                    'data': s_list_of_texts(
                        t_block_2_lines.Group($p.group, { 'indentation': $p.indentation }).map(($) => $ + $p.newline),
                    ),
                },
                ($) => ['write file', $],
            )
        ])
    ]
)