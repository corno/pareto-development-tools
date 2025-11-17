import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'failed to spawn': return _ea.ss($, ($) => sh.b.snippet(`failed to spawn process: ${$.message}`))
            case 'non zero exit code': return _ea.ss($, ($) => sh.b.sub([
                sh.b.snippet(`non zero exit code:`),
                sh.b.indent([
                    sh.g.nested_block([
                        sh.b.snippet(`exit code: `),
                        sh.b.snippet($['exit code'].transform(
                            ($) => `${$}`,
                            () => `n/a`
                        ))
                    ]),
                    sh.g.nested_block([
                        sh.b.snippet(`output:`),
                        sh.b.indent([
                            sh.g.nested_block([
                                sh.b.snippet($.stderr) //FIX this should be split up in lines
                            ])
                        ])
                    ])
                ])
            ]))
            default: return _ea.au($[0])
        }
    })
}