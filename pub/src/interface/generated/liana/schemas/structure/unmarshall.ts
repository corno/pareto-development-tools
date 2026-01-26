
import * as _pi from "pareto-core/dist/interface"

import * as i_generic from "../../generic/unmarshall"

import * as i_out from "./data"

import * as i_in from "astn-core/dist/interface/generated/liana/schemas/parse_tree/data"

export namespace Directory_ {
    
    export type I = i_in.Value
    
    export type O = i_out.Directory
    
    export type E = i_generic.Error
    
    export namespace P {
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
    abort: _pi.Abort<Directory_.E>,
) => Directory_.O

export { 
    Directory_ as Directory, 
}
