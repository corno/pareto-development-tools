import * as p_ from 'pareto-core/command_interface'

import type * as s_get_project_files from "../schemas/get_project_files/schema.js"
import type * as s_list_package_file_structure_problems from "../schemas/list_package_file_structure_problems/schema.js"



export type analyze_project_file_structure = p_.Command_Interface<
    s_get_project_files.Error,
    s_get_project_files.Parameters
>

export type list_package_file_structure_problems = p_.Command_Interface<
    s_list_package_file_structure_problems.Error,
    s_list_package_file_structure_problems.Parameters
>
