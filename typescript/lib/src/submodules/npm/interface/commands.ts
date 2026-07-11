import * as p_ from 'pareto-core/interface/command_interface'

import type * as d_npm from "./schemas/npm_tool.js"
import type * as d_npm_publish from "./schemas/npm_publish.js"
import type * as d_update2latest from "./schemas/update2latest.js"
import type * as d_set_up_comparison_against_published from "./schemas/set_up_comparison_against_published.js"
import type * as d_update_package_dependencies from "./schemas/update_package_dependencies.js"

export type npm = p_.Command_Interface<
    d_npm.Error,
    d_npm.Parameters
>
export type npm_publish = p_.Command_Interface<
    d_npm_publish.Error,
    d_npm_publish.Parameters
>
export type update2latest = p_.Command_Interface<
    d_update2latest.Error,
    d_update2latest.Parameters
>
export type set_up_comparison_against_published = p_.Command_Interface<
    d_set_up_comparison_against_published.Error,
    d_set_up_comparison_against_published.Parameters
>
export type update_package_dependencies = p_.Command_Interface<
    d_update_package_dependencies.Error,
    d_update_package_dependencies.Parameters
>
