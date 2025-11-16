import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'

import * as d from "../../../../interface/temp/procedures/commands/git-assert-clean"

export const $$: d.Procedure = _easync.create_command_procedure(
    ($r, $p) => _easync.p.assert.query(
        $r.queries['is git clean'](
            {
                'path': $p.path,
            }
        ).transform_error_temp<d.Error>(
            ($) => ['unexpected error', $]
        ),
        ['working directory is not clean', null]
    )
)