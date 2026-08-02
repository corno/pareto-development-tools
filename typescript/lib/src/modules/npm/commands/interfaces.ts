import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_npm from "../schemas/npm_tool/schema.js"
import type * as s_npm_publish from "../schemas/npm_publish/schema.js"
import type * as s_update2latest from "../schemas/update2latest/schema.js"
import type * as s_set_up_comparison_against_published from "../schemas/set_up_comparison_against_published/schema.js"
import type * as s_update_package_dependencies from "../schemas/update_package_dependencies/schema.js"

export type npm = p_.Command_Interface<
    s_npm.Error,
    s_npm.Parameters
>
export type npm_publish = p_.Command_Interface<
    s_npm_publish.Error,
    s_npm_publish.Parameters
>
export type update2latest = p_.Command_Interface<
    s_update2latest.Error,
    s_update2latest.Parameters
>
export type set_up_comparison_against_published = p_.Command_Interface<
    s_set_up_comparison_against_published.Error,
    s_set_up_comparison_against_published.Parameters
>
export type update_package_dependencies = p_.Command_Interface<
    s_update_package_dependencies.Error,
    s_update_package_dependencies.Parameters
>
