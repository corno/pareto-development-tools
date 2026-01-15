
import * as _pi from "pareto-core-interface"

import * as i__location from "../../core/location"

export namespace Directory_ {
    
    export type dictionary = Directory_
    
    export namespace group {
        
        export namespace D {
            
            export type directory = Directory_
            
            export namespace file {
                
                export type manual = null
                
                export namespace generated {
                    
                    export type commit_to_git = boolean
                    
                }
                
                export type generated = {
                    readonly 'commit to git': generated.commit_to_git
                }
                
            }
            
            export type file = 
                | readonly ['manual', file.manual]
                | readonly ['generated', file.generated]
            
        }
        
        export type D = 
            | readonly ['directory', D.directory]
            | readonly ['file', D.file]
        
    }
    
    export type group = _pi.Dictionary<group.D>
    
    export namespace wildcards {
        
        export type required_directories = number
        
        export type additional_directories_allowed = boolean
        
        export namespace extensions {
            
            export type L = string
            
        }
        
        export type extensions = _pi.List<extensions.L>
        
        export type warn = boolean
        
    }
    
    export type wildcards = {
        readonly 'required directories': wildcards.required_directories
        readonly 'additional directories allowed': wildcards.additional_directories_allowed
        readonly 'extensions': wildcards.extensions
        readonly 'warn': wildcards.warn
    }
    
    export type freeform = null
    
    export type ignore = null
    
    export namespace generated {
        
        export type commit_to_git = boolean
        
    }
    
    export type generated = {
        readonly 'commit to git': generated.commit_to_git
    }
    
}

export type Directory_ = 
    | readonly ['dictionary', Directory_.dictionary]
    | readonly ['group', Directory_.group]
    | readonly ['wildcards', Directory_.wildcards]
    | readonly ['freeform', Directory_.freeform]
    | readonly ['ignore', Directory_.ignore]
    | readonly ['generated', Directory_.generated]

export { 
    Directory_ as Directory, 
}
