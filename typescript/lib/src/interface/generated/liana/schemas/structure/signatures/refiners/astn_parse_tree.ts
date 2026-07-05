
import * as p_i from 'pareto-core/interface/__internal/Abort'

import * as i_generic from "liana-core/interface/data/unmarshall"

import * as i_out from "../../data.js"

import * as i_in from "astn-core/interface/generated/liana/schemas/parse_tree/data"

export namespace Directory_ {
    
    export type I = i_in.Value
    
    export type O = i_out.Directory
    
    export type E = i_generic.Error
    
    export namespace P {
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
    abort: p_i.Abort<Directory_.E>,
) => Directory_.O

export type { 
    Directory_ as Directory, 
}
