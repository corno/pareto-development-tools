

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
}

export type Module = {
    'schemas': Schemas
    'modules': Module.modules
}

export type Schemas = p_schema.Dictionary<Schema>

export type Schema = {
    'schema': s_typescript_directory.File
}