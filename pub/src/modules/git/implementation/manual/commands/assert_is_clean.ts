import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/assert_is_clean"

export const $$: signatures.commands.assert_is_clean = _p.create_command_procedure(
    ($p, $cr, $qr) => [
        _p.assert.query(
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