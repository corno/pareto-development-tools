import * as _pi from 'pareto-core-interface'

import * as d_analyze_file_structure from "./to_be_generated/analyze_file_structure"
import * as d_api from "./to_be_generated/execute_command"
import * as d_build from "./to_be_generated/build"
import * as d_build_and_test from "./to_be_generated/build_and_test"
import * as d_create_dependency_graph from "./to_be_generated/create_dependency_graph"
import * as d_get_package_dependencies from "./to_be_generated/get_package_dependencies"
import * as d_publish from "./to_be_generated/publish"
import * as d_tsc from "./to_be_generated/tsc"
import * as d_update_package_dependencies from "./to_be_generated/update_package_dependencies"



export namespace queries {
    
    export type get_package_dependencies = _pi.Query<d_get_package_dependencies.Result, d_get_package_dependencies.Error, d_get_package_dependencies.Parameters>

}

export namespace commands {

    export type analyze_file_structure = _pi.Command<d_analyze_file_structure.Error, d_analyze_file_structure.Parameters>
    export type api = _pi.Command<d_api.Error, d_api.Parameters>
    export type build = _pi.Command<d_build.Error, d_build.Parameters>
    export type build_and_test = _pi.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    export type create_dependency_graph = _pi.Command<d_create_dependency_graph.Error, d_create_dependency_graph.Parameters>
    export type publish = _pi.Command<d_publish.Error, d_publish.Parameters>
    export type tsc = _pi.Command<d_tsc.Error, d_tsc.Parameters>
    export type update_package_dependencies = _pi.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>
    
}