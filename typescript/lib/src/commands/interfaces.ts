import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_command_instruction from "../schemas/command_instruction.js"
import type * as s_command_error from "../schemas/command_error.js"
import type * as s_build from "../schemas/build.js"
import type * as s_build_and_validate from "../schemas/build_and_validate.js"
import type * as s_create_dependency_graph from "../submodules/dependency_graph/schemas/create_dependency_graph.js"
import type * as s_publish from "../schemas/publish.js"
import type * as s_tsc from "../schemas/tsc.js"
import type * as s_update_package_dependencies from "../schemas/update_package_dependencies.js"
import type * as s_version_control_commit from "../schemas/git_commit.js"

export type api = p_.Command_Interface<
    s_command_error.Error,
    s_command_instruction.Parameters
>
export type build = p_.Command_Interface<
    s_build.Error,
    s_build.Parameters
>
export type build_and_validate = p_.Command_Interface<
    s_build_and_validate.Error,
    s_build_and_validate.Parameters
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