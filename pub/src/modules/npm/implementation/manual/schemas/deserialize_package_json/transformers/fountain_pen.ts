import * as _p from 'pareto-core-transformer'
import * as _pi from 'pareto-core-interface'

import * as d_in from "../../../../../interface/to_be_generated/deserialize_package_json"
import * as d_out from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/target"

export namespace signatures {
    export type Error = _pi.Transformer<d_in.Error, d_out.Block_Part>
}

//dependencies
import * as t_read_file_to_fountain_pen from "pareto-resources/dist/implementation/manual/schemas/read_file/transformers/fountain_pen"

//shorthands
import * as sh from "pareto-fountain-pen/dist/shorthands/block"

export const Error: signatures.Error = ($) => _p.sg($, ($) => {
    switch ($[0]) {
        case 'invalid ASTN': return _p.ss($, ($) => sh.b.snippet(`invalid JSON (or even ASTN)`))
        case 'missing root object': return _p.ss($, ($) => sh.b.snippet(`missing root object in package.json`))
        case 'name': return _p.ss($, ($) => sh.b.snippet(`missing or invalid 'name' property in package.json`))
        case 'version': return _p.ss($, ($) => sh.b.snippet(`missing or invalid 'version' property in package.json`))
        case 'dependencies': return _p.ss($, ($) => sh.b.snippet(`missing or invalid 'dependencies' property in package.json`))
        default: return _p.au($[0])
    }
})