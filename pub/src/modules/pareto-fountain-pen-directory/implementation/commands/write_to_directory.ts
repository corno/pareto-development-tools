
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'
import * as _easync from 'exupery-core-async'

import * as signatures from "../../interface/signatures"

//data types
import * as d_write_to_directory from "../../interface/to_be_generated/write_to_dictionary"

//dependencies
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/schemas/path/path"

export const $$: signatures.commands.write_to_directory = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _easync.p.sequence<d_write_to_directory.Error>([
            _easync.p.if_(
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
            _easync.p.dictionary.parallel(
                $p.directory,
                ($, key) => [
                    _ea.cc($, ($): _et.Command_Promise<d_write_to_directory.Error__nodes> => {
                        switch ($[0]) {
                            case 'file':
                                return _ea.ss($, ($) => {
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
                                return _ea.ss($, ($) => {
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
                            default: return _ea.au($[0])
                        }
                    }),
                ],
                ($): d_write_to_directory.Error => ['nodes', $]
            )
        ])
    ]
)