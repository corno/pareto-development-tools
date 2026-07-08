import type * as d_deserialize from "astn-core/interface/generated/liana/schemas/deserialize_parse_tree/data"
import type * as d_path from "pareto-resources/interface/generated/liana/schemas/fs_unrestricted_path/data"

export type Error = {
    'path': d_path.Node_Path
    'type':
    | ['invalid ASTN', d_deserialize.Error]
    | ['missing root object', null]
    | ['name',
        | ['missing', null]
        | ['not a text', null]
    ]
    | ['version',

        | ['missing', null]
        | ['not a text', null]
    ]
    | ['dependencies',
        | ['not an object', null]
        | ['not a text', string]
    ]
}