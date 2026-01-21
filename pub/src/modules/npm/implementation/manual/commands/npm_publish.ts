import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.npm_publish = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _pt.list.nested_literal_old([
                    [
                        `publish`
                    ],
                    $p.path.__decide(
                        ($) => _pt.list.literal([
                            s_path.Context_Path($),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    _p.sg($p.impact, ($) => {
                        switch ($[0]) {
                            case 'dry run': return _p.ss($, ($) => [ `--dry-run` ])
                            case 'actual publish': return _p.ss($, ($) => [
                                `--otp`,
                                $['one time password'],
                            ])
                            default: return _p.au($[0])
                        }
                    }),
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)