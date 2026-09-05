import * as p_ from 'pareto-core/command_interface'

import type * as s_command_instruction from "../schemas/command_instruction/schema.js"
import type * as s_command_error from "../schemas/command_error/schema.js"
import type * as s_build from "../schemas/build/schema.js"
import type * as s_build_and_validate from "../schemas/build_and_validate/schema.js"
import type * as s_publish from "../schemas/publish/schema.js"
import type * as s_tsc from "../schemas/tsc/schema.js"
import type * as s_update_package_dependencies from "../schemas/update_package_dependencies/schema.js"
import type * as s_version_control_commit from "../schemas/git_commit/schema.js"
import type * as s_file_structure_validation from "../schemas/file_structure_validation/schema.js"

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


export type validate_file_structure = p_.Command_Interface<
    s_file_structure_validation.Error,
    s_file_structure_validation.Parameters
>