import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../interface/algorithms/commands/assert-clean"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _easync.p.deprecated_assert.query(
            $qr['is git clean'](
                {
                    'path': $p.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ['working directory is not clean', null]
        )
    ]
)