import type * as d_deserialize from "astn-core/interface/data/deserialize_parse_tree"
import type * as d_path from "pareto-resources/interface/data/fs_unrestricted_path"

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