

import * as p_ from "pareto-core/schema"

export type Package = {
    'typescript': {
        'lib': {
            'src': Module
        }
    }
}

export namespace Module {
    export type modules = p_.Dictionary<Module>
    export type commands = {
        'interfaces': p_.Dictionary<null>
        'implementations': p_.Dictionary<null>
    }
    export type queries = {
        'interfaces': p_.Dictionary<null>
        'implementations': p_.Dictionary<null>
    }
}

export type Module = {
    'schemas': Schemas
    'modules': Module.modules
    'commands': Module.commands
}

export type Schemas = p_.Dictionary<Schema>

export type Schema = {
    'schema': Schema.schema
    'transformers': Schema.transformers
    'serializers': Schema.serializers
    'refiners': Schema.refiners
    'deserializers': Schema.deserializers
}
export namespace Schema {
    export type schema = null
    export type transformers = p_.Dictionary<transformers.D>
    export namespace transformers {
        export type D = {
            'statements': p_.List<statement>
        }
        export type statement = 
        | ['uitwerken', null]
    }
    export type serializers = null
    export type refiners = null
    export type deserializers = null
}
