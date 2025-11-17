import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/source"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => {
    return _ea.cc($, ($) => {
        switch ($[0]) {
            case 'directory already exists': return _ea.ss($, ($) => sh.b.snippet(`directory already exists`))
            case 'permission denied': return _ea.ss($, ($) => sh.b.snippet(`permission denied`))
            default: return _ea.au($[0])
        }
    })
}