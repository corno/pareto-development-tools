import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/commands/assert-clean"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _easync.p.deprecated_assert.query(
            $qr['is git clean'](
                {
                    'path': $p.path,
                }
            ).transform_error_temp<d.Error>(
                ($) => ['unexpected error', $]
            ),
            ['working directory is not clean', null]
        )
    ]
)