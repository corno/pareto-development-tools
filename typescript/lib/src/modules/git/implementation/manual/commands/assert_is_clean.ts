import * as p_ from 'pareto-core/dist/implementation/command'

import * as interface_ from "../../../../version_control_api/interface/commands"

//data types
import * as d from "../../../../version_control_api/interface/data/assert_is_clean"

export const $$: interface_.procedures.assert_is_clean = p_.command_procedure(
    ($d, $s, $q, $c) => [

        p_.s.query(
            $q['is repository clean'](
                {
                    'path': $d.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ($) => [

                p_.s.assert(
                    $,
                    ['working directory is not clean', null]
                )

            ]
        ),

    ]
)