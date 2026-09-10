

import * as p_schema from "pareto-core/schema"

import type * as s_typescript_directory from "../typescript_directory/schema.js"


export type Package = {
    'typescript': {
        'lib': {
            'src': Module
        }
    }
}

export namespace Module {
    export type modules = p_schema.Dictionary<Module>
    export type commands = {
        'interfaces': p_schema.Dictionary<null>
        'implementations': p_schema.Dictionary<null>
    }
    export type queries = {
        'interfaces': p_schema.Dictionary<null>
        'implementations': p_schema.Dictionary<null>
    }
}

export type Module = {
    'schemas': Schemas
    'modules': Module.modules
    'commands': Module.commands
}

export type Schemas = p_schema.Dictionary<Schema>

export type Schema = {
    'schema': Schema.schema
    'transformers': Schema.transformers
    'serializers': Schema.serializers
    'refiners': Schema.refiners
    'deserializers': Schema.deserializers
}
export namespace Schema {
    export type schema = null
    export type transformers = p_schema.Dictionary<null>
    export type serializers = null
    export type refiners = null
    export type deserializers = null
}
