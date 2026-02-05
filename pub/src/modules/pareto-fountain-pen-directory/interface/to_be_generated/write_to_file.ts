
import * as d_write_file from "pareto-resources/dist/interface/generated/liana/schemas/write_file/data"
import * as d_make_directory from "pareto-resources/dist/interface/generated/liana/schemas/make_directory/data"
import * as d_fp_block from "pareto-fountain-pen/dist/interface/generated/liana/schemas/block/data"
import * as d_path from "pareto-resources/dist/interface/generated/liana/schemas/path/data"

export type Error =
    | ['make directory', d_make_directory.Error]
    | ['write file', d_write_file.Error]

export type Parameters = {
    'escape spaces in path': boolean
    'paragraph': d_fp_block.Paragraph,
    'directory path': d_path.Node_Path
    'filename': string
    'indentation': string
    'newline': string
}