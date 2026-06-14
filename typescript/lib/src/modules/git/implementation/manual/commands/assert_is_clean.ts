import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'

import * as signatures from "../../../interface/signatures"

//data types
import * as d from "../../../interface/to_be_generated/assert_is_clean"

export const $$: signatures.commands.assert_is_clean = _p.command_procedure(
    ($d, $s, $q, $c) => [
        _p.assert.query(
            $q['is repository clean'](
                {
                    'path': $d.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ['working directory is not clean', null]
        )
    ]
)