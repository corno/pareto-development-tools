import * as p_qi from 'pareto-core/dist/query/interface'

import * as resources_pareto from "pareto-resources/dist/interface/resources"

import * as d_get_package_dependencies from "./to_be_generated/get_package_dependencies"
import * as d_get_project_files from "./to_be_generated/get_project_files"

export namespace queries {
    
    export type get_project_files = p_qi.Query<d_get_project_files.Result, d_get_project_files.Error, d_get_project_files.Parameters>
    export type get_package_dependencies = p_qi.Query<d_get_package_dependencies.Result, d_get_package_dependencies.Error, d_get_package_dependencies.Parameters>

}

export namespace query_functions {

    export type get_project_files = p_qi.Query_Function<
        queries.get_project_files,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

    export type get_package_dependencies = p_qi.Query_Function<
        queries.get_package_dependencies,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

}