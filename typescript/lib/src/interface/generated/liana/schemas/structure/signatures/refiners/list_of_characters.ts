
import * as p_i from 'pareto-core/interface/__internal/Abort'

import * as i_generic from "liana-core/interface/data/deserialize"

import * as i_in from "pareto-fountain-pen/interface/generated/liana/schemas/list_of_characters/data"

import * as i_out from "../../data.js"

export namespace Directory_ {
    
    export type I = i_in.List_of_Characters
    
    export type O = i_out.Directory
    
    export type E = i_generic.Error
    
    export namespace P {
        
        export type tab_size = number
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
    abort: p_i.Abort<Directory_.E>,
    parameters: {
        readonly 'tab size': Directory_.P.tab_size
    },
) => Directory_.O

export type { 
    Directory_ as Directory, 
}
