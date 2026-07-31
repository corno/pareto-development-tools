import type * as s_deserialize from "astn-core/modules/deserialization/schemas/parse_tree_deserialization/schema"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"

export type Error = {
    'path': s_path.Node_Path
    'type':
    | ['invalid ASTN', s_deserialize.Error]
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