import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_get_project_files from "./schemas/get_project_files.js"
import type * as s_get_package_files from "./schemas/get_package_files.js"



export type analyze_project_file_structure = p_.Command_Interface<
    s_get_project_files.Error,
    s_get_project_files.Parameters
>

export type list_project_file_structure_problems = p_.Command_Interface<
    s_get_project_files.Error,
    s_get_project_files.Parameters
>

export type list_package_file_structure_problems = p_.Command_Interface<
    s_get_package_files.Error,
    s_get_package_files.Parameters
>