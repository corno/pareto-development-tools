
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pc from 'pareto-core-command'

import * as signatures from "../../interface/signatures"

//data types
import * as d_write_to_directory from "../../interface/to_be_generated/write_to_dictionary"

//dependencies
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"

export const $$: signatures.commands.write_to_directory = _pc.create_command_procedure(
    ($p, $cr, $qr) => [
        _pc.sequence<d_write_to_directory.Error>([
            _pc.if_(
                $p['remove before creating'],
                [
                    $cr.remove.execute(
                        {
                            'path': $p.path,
                            'error if not exists': false
                        },
                        ($) => ['remove', $],
                    )
                ]
            ),
            _pc.dictionary.parallel(
                $p.directory,
                ($, key) => [
                    _pt.cc($, ($): _pi.Command_Promise<d_write_to_directory.Error__nodes> => {
                        switch ($[0]) {
                            case 'file':
                                return _pt.ss($, ($) => {
                                    return $cr['write to_file'].execute(
                                        {
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
                                            'directory': $,
                                            'path': t_path_to_path.extend_node_path($p.path, { 'addition': key }),
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
        ])
    ]
)