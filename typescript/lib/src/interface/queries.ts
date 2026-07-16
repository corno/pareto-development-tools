import * as p_ from 'pareto-core/interface/query_interface'

import type * as s_get_package_dependencies from "../submodules/dependency_graph/schemas/get_package_dependencies.js"
import type * as s_get_project_files from "../submodules/file_structure_analysis/schemas/get_project_files.js"

export type get_project_files = p_.Query_Interface<s_get_project_files.Result, s_get_project_files.Error, s_get_project_files.Parameters>
export type get_package_dependencies = p_.Query_Interface<s_get_package_dependencies.Result, s_get_package_dependencies.Error, s_get_package_dependencies.Parameters>
