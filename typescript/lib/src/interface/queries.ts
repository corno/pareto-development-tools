import * as p_ from 'pareto-core/interface/query'

import * as resources_pareto from "pareto-resources/interface/resources"

import * as d_get_package_dependencies from "./data/get_package_dependencies.js"
import * as d_get_project_files from "./data/get_project_files.js"

export namespace queries {
    
    export type get_project_files = p_.Query<d_get_project_files.Result, d_get_project_files.Error, d_get_project_files.Parameters>
    export type get_package_dependencies = p_.Query<d_get_package_dependencies.Result, d_get_package_dependencies.Error, d_get_package_dependencies.Parameters>

}

export namespace query_functions {

    export type get_project_files = p_.Query_Function<
        queries.get_project_files,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

    export type get_package_dependencies = p_.Query_Function<
        queries.get_package_dependencies,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

}