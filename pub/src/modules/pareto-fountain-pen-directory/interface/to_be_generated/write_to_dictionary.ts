import * as _pi from 'pareto-core-interface'

import * as d_remove from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/target"
import * as d_fp_block from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_write_to_file from "./write_to_file"

export type Error =
    | ['remove', d_remove.Error]
    | ['nodes', _pi.Dictionary<Error__nodes>]

export type Error__nodes =
    | ['directory', Error]
    | ['file', d_write_to_file.Error]

export type Parameters = {
    'path': d_path.Node_Path
    'directory': d_fp_block.Directory,
    'indentation': string
    'newline': string
    'remove before creating': boolean
}