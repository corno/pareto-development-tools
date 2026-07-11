import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_get_project_files from "./schemas/get_project_files.js"
import type * as s_api from "./schemas/execute_command.js"
import type * as s_build from "./schemas/build.js"
import type * as s_build_and_test from "./schemas/build_and_test.js"
import type * as s_create_dependency_graph from "./schemas/create_dependency_graph.js"
import type * as s_publish from "./schemas/publish.js"
import type * as s_tsc from "./schemas/tsc.js"
import type * as s_update_package_dependencies from "./schemas/update_package_dependencies.js"
import type * as s_version_control_commit from "./schemas/git_commit.js"

export type analyze_file_structure = p_.Command_Interface<
    s_get_project_files.Error,
    s_get_project_files.Parameters
>
export type api = p_.Command_Interface<
    s_api.Error,
    s_api.Parameters
>
export type build = p_.Command_Interface<
    s_build.Error,
    s_build.Parameters
>
export type build_and_test = p_.Command_Interface<
    s_build_and_test.Error,
    s_build_and_test.Parameters
>
export type create_dependency_graph = p_.Command_Interface<
    s_create_dependency_graph.Error,
    s_create_dependency_graph.Parameters
>
export type version_control_commit = p_.Command_Interface<
    s_version_control_commit.Error,
    s_version_control_commit.Parameters
>
export type publish = p_.Command_Interface<
    s_publish.Error,
    s_publish.Parameters
>
export type tsc = p_.Command_Interface<
    s_tsc.Error,
    s_tsc.Parameters
>
export type update_package_dependencies = p_.Command_Interface<
    s_update_package_dependencies.Error,
    s_update_package_dependencies.Parameters
>