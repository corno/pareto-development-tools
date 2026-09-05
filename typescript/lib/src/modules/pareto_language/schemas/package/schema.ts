

import * as p_schema from "pareto-core/schema"

import type * as s_typescript_directory from "../typescript_directory/schema.js"


export type Package = {
    'typescript': {
        'lib': {
            'src': {
                'schemas': Schemas
            }
        }
    }
}

export type Schemas = p_schema.Dictionary<Schema>

export type Schema = {
    'schema': s_typescript_directory.File
}