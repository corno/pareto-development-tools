
import * as _pi from "pareto-core/dist/interface"

import * as i_in from "./data"

export namespace Directory_ {
    
    export type I = i_in.Directory
    
    export type O = string
    
    export namespace P {
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
) => Directory_.O

export { 
    Directory_ as Directory, 
}
