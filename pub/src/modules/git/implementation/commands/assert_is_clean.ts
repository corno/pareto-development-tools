import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as signatures from "../../interface/signatures"

//data types
import * as d from "../../interface/to_be_generated/assert_is_clean"

export const $$: signatures.commands.assert_is_clean = _easync.create_command_procedure(
    ($p, $cr, $qr) => [
        _easync.p.deprecated_assert.query(
            $qr['is repository clean'](
                {
                    'path': $p.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ['working directory is not clean', null]
        )
    ]
)