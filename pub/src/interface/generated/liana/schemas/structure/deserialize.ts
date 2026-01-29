
import * as _pi from "pareto-core/dist/interface"

import * as i_generic from "../../generic/deserialize"

import * as i_out from "./data"

export namespace Directory_ {
    
    export type I = string
    
    export type O = i_out.Directory
    
    export type E = i_generic.Error
    
    export namespace P {
        
        export type document_resource_identifier = string
        
        export type tab_size = number
        
    }
    
}

export type Directory_ = (
    context: Directory_.I,
    abort: _pi.Abort<Directory_.E>,
    parameters: {
        readonly 'document resource identifier': Directory_.P.document_resource_identifier
        readonly 'tab size': Directory_.P.tab_size
    },
) => Directory_.O

export { 
    Directory_ as Directory, 
}
