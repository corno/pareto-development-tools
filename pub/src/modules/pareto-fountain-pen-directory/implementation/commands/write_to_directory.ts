
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/source"

import * as D from "../../interface/temp_types"

import { $$ as p_write_to_node } from "./write_to_node"
// import { Signature } from "../../../interface/algorithms/procedures/unguaranteed/write_to_directory"

import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"


export type Query_Resources = null

export type Command_Resources = {
    'remove': _et.Command<d_remove.Error, d_remove.Parameters>
    'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
    'write file': _et.Command<d_write_file.Error, d_write_file.Parameters>
}

export const $$: _et.Command_Procedure<D.Directory_Error, D.Directory_Parameters, Command_Resources, Query_Resources> = _easync.create_command_procedure(
    ($p, $cr) => [
        _easync.p.sequence<D.Directory_Error>([
            _easync.p.if_(
                $p['remove before creating'],
                [
                    $cr.remove.execute(
                        {
                            'path': {
                                'path': $p.path,
                                'escape spaces in path': true,
                            },
                            'error if not exists': false
                        },
                        ($) => ['remove', $],
                    )
                ]
            ),
            _easync.p.dictionary.parallel(
                $p.directory,
                ($, key) => [
                    p_write_to_node(
                        {
                            'remove': $cr.remove,
                            'make directory': $cr['make directory'],
                            'write file': $cr['write file'],
                        },
                        null,
                    ).execute(
                        {
                            'node': $,
                            'path': $p.path,
                            'key': key,
                            'indentation': $p.indentation,
                            'newline': $p.newline,
                            'remove before creating': false,
                        },
                        ($) => $,
                    ),
                ],
                ($): D.Directory_Error => ['nodes', $]
            )
        ])
    ]
)