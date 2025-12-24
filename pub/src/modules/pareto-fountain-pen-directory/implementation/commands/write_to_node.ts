
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import * as _easync from 'exupery-core-async'

import * as D from "../../interface/temp_types"

import { $$ as p_write_to_file } from "./write_to_file"
import { $$ as p_write_to_directory } from "./write_to_directory"
// import { Signature } from "../../../interface/algorithms/procedures/unguaranteed/write_to_node"

import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/source"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/source"

import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"

export type Query_Resources = null

export type Command_Resources = {
    'remove': _et.Command<d_remove.Error, d_remove.Parameters>
    'make directory': _et.Command<d_make_directory.Error, d_make_directory.Parameters>
    'write file': _et.Command<d_write_file.Error, d_write_file.Parameters>
}

export const $$: _et.Command_Procedure<_et.Command<D.Node_Error, D.Node_Parameters>, Command_Resources, Query_Resources> = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _ea.cc($p.node, ($) => {
            switch ($[0]) {
                case 'file':
                    return _ea.ss($, ($) => {
                        return p_write_to_file($cr, $qr).execute(
                            {
                                'group': $,
                                'directory path': $p.path,
                                'filename': $p.key,
                                'indentation': $p.indentation,
                                'newline': $p.newline
                            },
                            ($): D.Node_Error => ['file', $],
                        )
                    })
                case 'directory':
                    return _ea.ss($, ($) => {
                        return p_write_to_directory($cr, $qr).execute(
                            {
                                'directory': $,
                                'path': t_path_to_path.extend_node_path($p.path, { 'addition': $p.key }),
                                'indentation': $p.indentation,
                                'newline': $p.newline,
                                'remove before creating': false,
                            },
                            ($): D.Node_Error => ['directory', $],
                        )
                    })
                default: return _ea.au($[0])
            }
        })
    ]
)