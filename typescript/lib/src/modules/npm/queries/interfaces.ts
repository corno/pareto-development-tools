import * as p_ from 'pareto-core/query_interface'

import type * as s_get_package_json from "../schemas/get_package_json/schema.js"

export type get_package_json = p_.Query_Interface<
    s_get_package_json.Result,
    s_get_package_json.Error,
    s_get_package_json.Parameters
>