import * as p_ from 'pareto-core/interface/query_interface'

import type * as s_get_package_dependencies from "../schemas/get_package_dependencies/schema.js"

export type get_package_dependencies = p_.Query_Interface<s_get_package_dependencies.Result, s_get_package_dependencies.Error, s_get_package_dependencies.Parameters>
