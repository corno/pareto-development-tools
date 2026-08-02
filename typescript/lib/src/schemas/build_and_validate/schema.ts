
import type * as s_epe from "pareto-resources/schemas/execute_sandboxed_command_executable/schema"
import type * as s_build from "../build/schema.js"
import type * as s_path from "pareto-resources/schemas/fs_unrestricted_path/schema"
import type * as s_file_structure_validation from "../../modules/file_structure_analysis/schemas/file_structure_validation/schema.js"

export type Parameters = {
    'path': s_path.Context_Path,
}

export type Error =
    | ['building', s_build.Error]
    | ['testing', s_epe.Error]
    | ['file structure validation', s_file_structure_validation.Error]
