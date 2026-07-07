import * as p_ from 'pareto-core/interface/command_action'

import * as d_npm from "./data/npm_tool.js"
import * as d_npm_publish from "./data/npm_publish.js"
import * as d_update2latest from "./data/update2latest.js"
import * as d_set_up_comparison_against_published from "./data/set_up_comparison_against_published.js"
import * as d_update_package_dependencies from "./data/update_package_dependencies.js"

export type npm = p_.Command_Action<d_npm.Error, d_npm.Parameters>
export type npm_publish = p_.Command_Action<d_npm_publish.Error, d_npm_publish.Parameters>
export type update2latest = p_.Command_Action<d_update2latest.Error, d_update2latest.Parameters>
export type set_up_comparison_against_published = p_.Command_Action<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
export type update_package_dependencies = p_.Command_Action<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>
