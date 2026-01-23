
import * as _pi from "pareto-core/dist/interface"

import * as i_out from "./data"

export namespace Directory_ {
    
    export type I = string
    
    export type O = i_out.Directory
    
    export namespace P {
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
) => Directory_.O

export { 
    Directory_ as Directory, 
}
