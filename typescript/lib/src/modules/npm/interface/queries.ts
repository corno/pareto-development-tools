import * as p_ from 'pareto-core/interface/query'

import * as d_get_package_json from "./data/get_package_json.js"

import * as resources_pareto from "pareto-resources/interface/resources"


export namespace queries {

    export type get_package_json = p_.Query<d_get_package_json.Result, d_get_package_json.Error, d_get_package_json.Parameters>
}


export namespace query_functions {

    export type get_package_json = p_.Query_Function<
        queries.get_package_json,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        }
    >

}