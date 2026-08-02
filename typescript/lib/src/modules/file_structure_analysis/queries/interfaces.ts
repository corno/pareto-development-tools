import * as p_ from 'pareto-core/interface/query_interface'

import type * as s_get_project_files from "../schemas/get_project_files/schema.js"
import type * as s_get_package_files from "../schemas/get_package_files/schema.js"

export type get_project_files = p_.Query_Interface<
    s_get_project_files.Result,
    s_get_project_files.Error,
    s_get_project_files.Parameters
>
export type get_package_files = p_.Query_Interface<
    s_get_package_files.Result,
    s_get_package_files.Error,
    s_get_package_files.Parameters
>