import * as p_ from 'pareto-core/interface/query_interface'

import type * as d_get_package_dependencies from "./schemas/get_package_dependencies.js"
import type * as d_get_project_files from "./schemas/get_project_files.js"

export type get_project_files = p_.Query_Interface<d_get_project_files.Result, d_get_project_files.Error, d_get_project_files.Parameters>
export type get_package_dependencies = p_.Query_Interface<d_get_package_dependencies.Result, d_get_package_dependencies.Error, d_get_package_dependencies.Parameters>
