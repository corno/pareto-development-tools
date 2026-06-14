import * as p_ from 'pareto-core/dist/command'

import * as signatures from "../../../interface/commands"

//data types
import * as d from "../../../interface/to_be_generated/assert_is_clean"

export const $$: signatures.procedures.assert_is_clean = p_.command_procedure(
    ($d, $s, $q, $c) => [
        p_.assert.query(
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