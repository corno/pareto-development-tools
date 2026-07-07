import * as p_ from 'pareto-core/interface/command_action'

import * as d_get_project_files from "./data/get_project_files.js"
import * as d_api from "./data/execute_command.js"
import * as d_build from "./data/build.js"
import * as d_build_and_test from "./data/build_and_test.js"
import * as d_create_dependency_graph from "./data/create_dependency_graph.js"
import * as d_publish from "./data/publish.js"
import * as d_tsc from "./data/tsc.js"
import * as d_update_package_dependencies from "./data/update_package_dependencies.js"
import * as d_version_control_commit from "./data/git_commit.js"

export type analyze_file_structure = p_.Command_Action<d_get_project_files.Error, d_get_project_files.Parameters>
export type api = p_.Command_Action<d_api.Error, d_api.Parameters>
export type build = p_.Command_Action<d_build.Error, d_build.Parameters>
export type build_and_test = p_.Command_Action<d_build_and_test.Error, d_build_and_test.Parameters>
export type create_dependency_graph = p_.Command_Action<d_create_dependency_graph.Error, d_create_dependency_graph.Parameters>
export type version_control_commit = p_.Command_Action<d_version_control_commit.Error, d_version_control_commit.Parameters>
export type publish = p_.Command_Action<d_publish.Error, d_publish.Parameters>
export type tsc = p_.Command_Action<d_tsc.Error, d_tsc.Parameters>
export type update_package_dependencies = p_.Command_Action<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>