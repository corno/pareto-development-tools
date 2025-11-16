import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d_in from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/source"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export type Error = _et.Transformer_Without_Parameters<d_in.Error, d_out.Block_Part>

import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: Error = ($) => _ea.cc($, ($) => {
    switch ($[0]) {
        case 'directory does not exist': return _ea.ss($, ($) => sh.b.snippet(`directory does not exist`))
        case 'node is not a directory':return _ea.ss($, ($) => sh.b.snippet(`node is not a directory`))
        default: return _ea.au($[0])
    }
})
