
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as t_block_2_lines from "pareto-fountain-pen/dist/implementation/algorithms/transformations/block/lines"

import * as D from "../../interface/temp_types"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/source"

import { $$ as op_join_list_of_texts } from "pareto-standard-operations/dist/implementation/algorithms/operations/pure/text/join_list_of_texts"

import * as r_path from "exupery-resources/dist/implementation/transformers/path/text"


import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"

export type Query_Resources = null

export type Command_Resources = {
    'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
    'write file': _et.Command<d_write_file.Error, d_write_file.Parameters>
}


export const $$: _et.Command_Procedure<D.File_Error, D.File_Parameters, Command_Resources, Query_Resources> = _easync.create_command_procedure(
    ($p, $cr) => [
        _easync.p.sequence<D.File_Error>([
            $cr['make directory'].execute(
                {
                    'path': $p['directory path'],
                    'escape spaces in path': true,
                },
                ($) => ['make directory', $],
            ),
            $cr['write file'].execute(
                {
                    'path': {
                        'path': t_path_to_path.create_node_path(t_path_to_path.node_path_to_context_path($p['directory path']), $p.filename),
                        'escape spaces in path': true,
                    },
                    'data': op_join_list_of_texts(
                        t_block_2_lines.Group($p.group, { 'indentation': $p.indentation }).map(($) => $ + $p.newline),
                    ),
                },
                ($) => ['write file', $],
            )
        ])
    ]
)