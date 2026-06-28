import * as p_ from 'pareto-core/dist/implementation/command'

import * as interface_ from "../../../interface/commands"

//data types
import * as d from "../../../../version_control_api/interface/data/assert_no_open_changes"

export const $$: interface_.procedures.assert_no_open_changes = p_.command_procedure(
    ($d, $s, $q, $c) => [

        p_.s.query(
            $q['repository no open changes'](
                {
                    'path': $d.path,
                },
                ($): d.Error => ['unexpected error', $]
            ),
            ($) => [

                p_.s.assert(
                    $,
                    ['working directory has open changes', null]
                )

            ]
        ),

    ]
)