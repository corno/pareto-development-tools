import * as _p from 'pareto-core-command'
import * as _pt from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'
import * as _pdev from 'pareto-core-dev'

import * as signatures from "../../../interface/signatures"

//dependencies
import * as s_path from "pareto-resources/dist/implementation/manual/schemas/path/serializers"

export const $$: signatures.commands.npm_publish = _p.command_procedure(
    ($p, $cr) => [
        $cr['npm'].execute(
            {
                'args': _pt.list.nested_literal([
                    [
                        `publish`
                    ],
                    $p.path.transform(
                        ($) => _pt.list.literal([
                            _pdev.log_debug_message(s_path.Context_Path($), () => s_path.Context_Path($)),
                        ]),
                        () => _pt.list.literal([])
                    ),
                    [
                        `--otp`,
                        $p['one time password'],
                    ],
                ]),
            },
            ($) => ['error while running npm', $],
        )
    ]
)