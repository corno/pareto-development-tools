import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/source"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'permission denied': return _ea.ss($, ($) => sh.b.snippet(`permission denied`))
            case 'file does not exist': return _ea.ss($, ($) => sh.b.snippet(`file does not exist`))
            case 'node is not a file': return _ea.ss($, ($) => sh.b.snippet(`node is not a file`))
            case 'file too large': return _ea.ss($, ($) => sh.b.snippet(`file too large`))
            case 'device not ready': return _ea.ss($, ($) => sh.b.snippet(`device not ready`))
            default: return _ea.au($[0])
        }
    })
}