
import * as d_write_file from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/target"
import * as d_make_directory from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/target"
import * as d_fp_block from "pareto-fountain-pen/dist/interface/generated/pareto/schemas/block/data_types/source"
import * as d_path from "exupery-resources/dist/interface/generated/pareto/schemas/path/data_types/target"

export type Error =
    | ['make directory', d_make_directory.Error]
    | ['write file', d_write_file.Error]

export type Parameters = {
    'escape spaces in path': boolean
    'group': d_fp_block.Group,
    'directory path': d_path.Node_Path
    'filename': string
    'indentation': string
    'newline': string
}