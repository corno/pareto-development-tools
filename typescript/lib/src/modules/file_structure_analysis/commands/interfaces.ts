import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_get_project_files from "../schemas/get_project_files/schema.js"
import type * as s_get_package_files from "../schemas/get_package_files/schema.js"

import type * as s_validate_no_file_structure_problems from "../schemas/file_structure_validation/schema.js"


export type analyze_project_file_structure = p_.Command_Interface<
    s_get_project_files.Error,
    s_get_project_files.Parameters
>

export type list_package_file_structure_problems = p_.Command_Interface<
    s_get_package_files.Error,
    s_get_package_files.Parameters
>

export type validate_file_structure = p_.Command_Interface<
    s_validate_no_file_structure_problems.Error,
    s_get_package_files.Parameters
>