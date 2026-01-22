import * as _pi from 'pareto-core/dist/interface'

import * as d_remove from "pareto-resources/dist/interface/generated/liana/schemas/remove/data"
import * as d_fp_block from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"
import * as d_write_to_file from "./write_to_file"

export type Error =
    | ['remove', d_remove.Error]
    | ['nodes', _pi.Dictionary<Error__nodes>]

export type Error__nodes =
    | ['directory', Error]
    | ['file', d_write_to_file.Error]

export type Parameters = {
    'escape spaces in path': boolean
    'path': d_path.Node_Path
    'directory': d_fp_block.Directory,
    'indentation': string
    'newline': string
    'remove before creating': boolean
}