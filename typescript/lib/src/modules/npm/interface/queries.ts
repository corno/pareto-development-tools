import * as p_qi from 'pareto-core/dist/interface/query'

import * as d_get_package_json from "./data/get_package_json"

import * as resources_pareto from "pareto-resources/dist/interface/resources"


export namespace queries {

    export type get_package_json = p_qi.Query<d_get_package_json.Result, d_get_package_json.Error, d_get_package_json.Parameters>
}


export namespace query_functions {

    export type get_package_json = p_qi.Query_Function<
        queries.get_package_json,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        }
    >

}