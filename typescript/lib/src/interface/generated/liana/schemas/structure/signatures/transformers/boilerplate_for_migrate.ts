
import * as p_i from 'pareto-core/interface/__internal/Abort'

import * as i_out from "../../data.js"

import * as i_in from "../../data.js"

export namespace Directory_ {
    
    export type I = i_in.Directory
    
    export type O = i_out.Directory
    
    export namespace P {
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
) => Directory_.O

export type { 
    Directory_ as Directory, 
}
