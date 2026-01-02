
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _p from 'pareto-core-command'

import * as signatures from "../../../interface/signatures"

//data types
import * as d_write_to_directory from "../../../interface/to_be_generated/write_to_dictionary"

//dependencies
import * as t_path_to_path from "pareto-resources/dist/implementation/manual/schemas/path/transformers/path"
import { replace_space_in_context_path } from "../schemas/path/transformers/path"


export const $$: signatures.commands.write_to_directory = _p.create_command_procedure(
    ($p, $cr, $qr) => [
        _p.if_.direct(
            $p['remove before creating'],
            [
                $cr.remove.execute(
                    {
                        'path': $p['escape spaces in path']
                            ? replace_space_in_context_path($p.path)
                            : $p.path,
                        'error if not exists': false
                    },
                    ($) => ['remove', $],
                )
            ]
        ),
        _p.dictionary.parallel(
            $p.directory,
            ($, key) => [
                _pt.cc($, ($): _pi.Command_Promise<d_write_to_directory.Error__nodes> => {
                    const node_path = t_path_to_path.extend_node_path($p.path, { 'addition': key })
                    switch ($[0]) {
                        case 'file':
                            return _pt.ss($, ($) => {
                                return $cr['write to_file'].execute(
                                    {
                                        'escape spaces in path': $p['escape spaces in path'],
                                        'group': $,
                                        'directory path': $p.path,
                                        'filename': key,
                                        'indentation': $p.indentation,
                                        'newline': $p.newline
                                    },
                                    ($): d_write_to_directory.Error__nodes => ['file', $],
                                )
                            })
                        case 'directory':
                            return _pt.ss($, ($) => {
                                return $$($cr, $qr).execute(
                                    {
                                        'escape spaces in path': $p['escape spaces in path'],
                                        'directory': $,
                                        'path': $p['escape spaces in path']
                                            ? replace_space_in_context_path(node_path)
                                            : node_path,
                                        'indentation': $p.indentation,
                                        'newline': $p.newline,
                                        'remove before creating': false,
                                    },
                                    ($): d_write_to_directory.Error__nodes => ['directory', $],
                                )
                            })
                        default: return _pt.au($[0])
                    }
                }),
            ],
            ($): d_write_to_directory.Error => ['nodes', $]
        )
    ]
)