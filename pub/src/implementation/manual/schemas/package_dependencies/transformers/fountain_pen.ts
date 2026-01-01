import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/get_package_dependencies"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"
export namespace signatures {
    export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>
}

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: signatures.Error = ($) => _p.cc($, ($) => {
    switch ($[0]) {
        case 'directory content processing': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`directory content processing: `),
            sh.b.indent([
                sh.g.sub($.to_list(($, key) => sh.g.nested_block([
                    sh.b.snippet(key),
                    sh.b.snippet(": "),
                    _p.cc($, ($) => {
                        switch ($[0]) {
                            case 'not a directory': return _p.ss($, ($) => sh.b.sub([
                                sh.b.snippet(`not a directory`),
                            ]))
                            case 'no package.json file': return _p.ss($, ($) => sh.b.sub([
                                sh.b.snippet(`no package.json file`),
                            ]))
                            case 'parse error': return _p.ss($, ($) => sh.b.sub([
                                sh.b.snippet(`parse error: `),
                                sh.b.indent([
                                    sh.g.nested_block([
                                        // t_read_file_to_fountain_pen.Error($)
                                    ])
                                ])
                            ]))
                            default: return _p.au($[0])
                        }
                    })
                ])))
            ])
        ]))
        case 'read directory': return _p.ss($, ($) => sh.b.sub([
            sh.b.snippet(`read directory: `),
        ]))
        default: return _p.au($[0])
    }
})