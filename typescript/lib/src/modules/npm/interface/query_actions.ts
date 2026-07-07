import * as p_ from 'pareto-core/interface/query_action'

import * as d_get_package_json from "./data/get_package_json.js"

export type get_package_json = p_.Query_Action<d_get_package_json.Result, d_get_package_json.Error, d_get_package_json.Parameters>