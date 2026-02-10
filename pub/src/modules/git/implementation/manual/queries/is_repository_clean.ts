import * as _p from 'pareto-core/dist/query'
import * as _pi from 'pareto-core/dist/interface'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/is_repository_clean"

//dependencies
import * as t_path_to_text from "pareto-resources/dist/implementation/manual/schemas/path/transformers/text"

//shorthands
import * as sh from "../../../../../temp_loc_to_string"

export const $$: signatures.queries.is_repository_clean = _p.query_function(
    ($p, $qr) => $qr.git(
        {
            'args': _p.list.nested_literal([
                $p.path.__decide(
                    ($) => _p.list.literal([
                        "-C",
                        sh.serialize(t_path_to_text.Context_Path($)),
                    ]),
                    () => _p.list.literal([])
                ),
                _p.list.literal([
                    "status",
                    "--porcelain",
                ])
            ]),
        },
        ($) => $,
    ).transform_result<boolean>(
        ($) => $.stdout.raw === ""
    ).rework_error_temp(
        ($current) => $qr['is inside git work tree'](
            {
                'path': $p.path
            },
            ($) => $
        ).transform_result<d.Error>(
            ($) => {
                return $
                    ? ['could not determine git status', $current]
                    : ['not a git repository', null]
            }
        ),
        ($): d.Error => ['unknown issue', $]
    )
)
