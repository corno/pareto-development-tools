import * as _pi from "pareto-core-interface"
    
    import * as _i_core from "../../../core/resolved"
    
    // **** TYPES
    
    export type _T_Directory = _i_core._T_State_Group<null, 
        | readonly ['dictionary', _T_Directory]
        | readonly ['group', _i_core._T_Dictionary<null, _i_core._T_State_Group<null, 
            | readonly ['directory', _T_Directory]
            | readonly ['file', _i_core._T_State_Group<null, 
                | readonly ['manual', null]
                | readonly ['generated', {
                    readonly 'commit to git': boolean
                }]
            >]
        >>]
        | readonly ['wildcards', {
            readonly 'required directories': number
            readonly 'additional directories allowed': boolean
            readonly 'extensions': _i_core._T_List<null, string>
            readonly 'warn': boolean
        }]
        | readonly ['freeform', null]
        | readonly ['ignore', null]
        | readonly ['generated', {
            readonly 'commit to git': boolean
        }]
    >
    
    // **** FRIENDLY NAMES FOR THE GLOBAL TYPES
    
    export type Directory = _T_Directory
    
    // **** ALIASES FOR NESTED TYPE WITH PREFIXED ROOT NAMES
    
    export namespace _T_Directory {
        
        export namespace SG {
            
            export namespace dictionary {
            }
            export type dictionary = _T_Directory
            
            export namespace group {
                
                export namespace D {
                    
                    export namespace SG {
                        
                        export namespace directory {
                        }
                        export type directory = _T_Directory
                        
                        export namespace file {
                            
                            export namespace SG {
                                export type manual = null
                                
                                export namespace generated {
                                    export type commit_to_git = boolean
                                }
                                export type generated = {
                                    readonly 'commit to git': boolean
                                }
                            }
                            export type SG = 
                                | readonly ['manual', null]
                                | readonly ['generated', {
                                    readonly 'commit to git': boolean
                                }]
                        }
                        export type file = _i_core._T_State_Group<null, 
                            | readonly ['manual', null]
                            | readonly ['generated', {
                                readonly 'commit to git': boolean
                            }]
                        >
                    }
                    export type SG = 
                        | readonly ['directory', _T_Directory]
                        | readonly ['file', _i_core._T_State_Group<null, 
                            | readonly ['manual', null]
                            | readonly ['generated', {
                                readonly 'commit to git': boolean
                            }]
                        >]
                }
                export type D = _i_core._T_State_Group<null, 
                    | readonly ['directory', _T_Directory]
                    | readonly ['file', _i_core._T_State_Group<null, 
                        | readonly ['manual', null]
                        | readonly ['generated', {
                            readonly 'commit to git': boolean
                        }]
                    >]
                >
            }
            export type group = _i_core._T_Dictionary<null, _i_core._T_State_Group<null, 
                | readonly ['directory', _T_Directory]
                | readonly ['file', _i_core._T_State_Group<null, 
                    | readonly ['manual', null]
                    | readonly ['generated', {
                        readonly 'commit to git': boolean
                    }]
                >]
            >>
            
            export namespace wildcards {
                export type required_directories = number
                export type additional_directories_allowed = boolean
                
                export namespace extensions {
                    export type L = string
                }
                export type extensions = _i_core._T_List<null, string>
                export type warn = boolean
            }
            export type wildcards = {
                readonly 'required directories': number
                readonly 'additional directories allowed': boolean
                readonly 'extensions': _i_core._T_List<null, string>
                readonly 'warn': boolean
            }
            export type freeform = null
            export type ignore = null
            
            export namespace generated {
                export type commit_to_git = boolean
            }
            export type generated = {
                readonly 'commit to git': boolean
            }
        }
        export type SG = 
            | readonly ['dictionary', _T_Directory]
            | readonly ['group', _i_core._T_Dictionary<null, _i_core._T_State_Group<null, 
                | readonly ['directory', _T_Directory]
                | readonly ['file', _i_core._T_State_Group<null, 
                    | readonly ['manual', null]
                    | readonly ['generated', {
                        readonly 'commit to git': boolean
                    }]
                >]
            >>]
            | readonly ['wildcards', {
                readonly 'required directories': number
                readonly 'additional directories allowed': boolean
                readonly 'extensions': _i_core._T_List<null, string>
                readonly 'warn': boolean
            }]
            | readonly ['freeform', null]
            | readonly ['ignore', null]
            | readonly ['generated', {
                readonly 'commit to git': boolean
            }]
    }
    
    // *** ALIASES FOR NESTED TYPES
    
    export namespace Directory {
        
        export namespace SG {
            
            export namespace dictionary {
            }
            export type dictionary = _T_Directory
            
            export namespace group {
                
                export namespace D {
                    
                    export namespace SG {
                        
                        export namespace directory {
                        }
                        export type directory = _T_Directory
                        
                        export namespace file {
                            
                            export namespace SG {
                                export type manual = null
                                
                                export namespace generated {
                                    export type commit_to_git = boolean
                                }
                                export type generated = {
                                    readonly 'commit to git': boolean
                                }
                            }
                            export type SG = 
                                | readonly ['manual', null]
                                | readonly ['generated', {
                                    readonly 'commit to git': boolean
                                }]
                        }
                        export type file = _i_core._T_State_Group<null, 
                            | readonly ['manual', null]
                            | readonly ['generated', {
                                readonly 'commit to git': boolean
                            }]
                        >
                    }
                    export type SG = 
                        | readonly ['directory', _T_Directory]
                        | readonly ['file', _i_core._T_State_Group<null, 
                            | readonly ['manual', null]
                            | readonly ['generated', {
                                readonly 'commit to git': boolean
                            }]
                        >]
                }
                export type D = _i_core._T_State_Group<null, 
                    | readonly ['directory', _T_Directory]
                    | readonly ['file', _i_core._T_State_Group<null, 
                        | readonly ['manual', null]
                        | readonly ['generated', {
                            readonly 'commit to git': boolean
                        }]
                    >]
                >
            }
            export type group = _i_core._T_Dictionary<null, _i_core._T_State_Group<null, 
                | readonly ['directory', _T_Directory]
                | readonly ['file', _i_core._T_State_Group<null, 
                    | readonly ['manual', null]
                    | readonly ['generated', {
                        readonly 'commit to git': boolean
                    }]
                >]
            >>
            
            export namespace wildcards {
                export type required_directories = number
                export type additional_directories_allowed = boolean
                
                export namespace extensions {
                    export type L = string
                }
                export type extensions = _i_core._T_List<null, string>
                export type warn = boolean
            }
            export type wildcards = {
                readonly 'required directories': number
                readonly 'additional directories allowed': boolean
                readonly 'extensions': _i_core._T_List<null, string>
                readonly 'warn': boolean
            }
            export type freeform = null
            export type ignore = null
            
            export namespace generated {
                export type commit_to_git = boolean
            }
            export type generated = {
                readonly 'commit to git': boolean
            }
        }
        export type SG = 
            | readonly ['dictionary', _T_Directory]
            | readonly ['group', _i_core._T_Dictionary<null, _i_core._T_State_Group<null, 
                | readonly ['directory', _T_Directory]
                | readonly ['file', _i_core._T_State_Group<null, 
                    | readonly ['manual', null]
                    | readonly ['generated', {
                        readonly 'commit to git': boolean
                    }]
                >]
            >>]
            | readonly ['wildcards', {
                readonly 'required directories': number
                readonly 'additional directories allowed': boolean
                readonly 'extensions': _i_core._T_List<null, string>
                readonly 'warn': boolean
            }]
            | readonly ['freeform', null]
            | readonly ['ignore', null]
            | readonly ['generated', {
                readonly 'commit to git': boolean
            }]
    }
