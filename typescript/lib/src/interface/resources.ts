import * as _pqi from 'pareto-core/dist/query_interface'
import * as _pci from 'pareto-core/dist/command_interface'

import * as d_get_project_files from "./to_be_generated/get_project_files"
import * as d_api from "./to_be_generated/execute_command"
import * as d_build from "./to_be_generated/build"
import * as d_build_and_test from "./to_be_generated/build_and_test"
import * as d_create_dependency_graph from "./to_be_generated/create_dependency_graph"
import * as d_get_package_dependencies from "./to_be_generated/get_package_dependencies"
import * as d_publish from "./to_be_generated/publish"
import * as d_tsc from "./to_be_generated/tsc"
import * as d_update_package_dependencies from "./to_be_generated/update_package_dependencies"
import * as d_git_commit from "./to_be_generated/git_commit"


export namespace queries {
    
    export type get_project_files = _pqi.Query<d_get_project_files.Result, d_get_project_files.Error, d_get_project_files.Parameters>
    export type get_package_dependencies = _pqi.Query<d_get_package_dependencies.Result, d_get_package_dependencies.Error, d_get_package_dependencies.Parameters>

}

export namespace commands {

    export type analyze_file_structure = _pci.Command<d_get_project_files.Error, d_get_project_files.Parameters>
    export type api = _pci.Command<d_api.Error, d_api.Parameters>
    export type build = _pci.Command<d_build.Error, d_build.Parameters>
    export type build_and_test = _pci.Command<d_build_and_test.Error, d_build_and_test.Parameters>
    export type create_dependency_graph = _pci.Command<d_create_dependency_graph.Error, d_create_dependency_graph.Parameters>
    export type git_commit = _pci.Command<d_git_commit.Error, d_git_commit.Parameters>
    export type publish = _pci.Command<d_publish.Error, d_publish.Parameters>
    export type tsc = _pci.Command<d_tsc.Error, d_tsc.Parameters>
    export type update_package_dependencies = _pci.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>
    
}