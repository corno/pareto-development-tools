import * as _pi from 'pareto-core-interface'

import * as d_npm from "./to_be_generated/npm_tool"
import * as d_npm_publish from "./to_be_generated/npm_publish"
import * as d_update2latest from "./to_be_generated/update2latest"
import * as d_set_up_comparison_against_published from "./to_be_generated/set_up_comparison_against_published"
import * as d_update_package_dependencies from "./to_be_generated/update_package_dependencies"

export namespace commands {

    export type npm = _pi.Command<d_npm.Error, d_npm.Parameters>
    export type npm_publish = _pi.Command<d_npm_publish.Error, d_npm_publish.Parameters>
    export type update2latest = _pi.Command<d_update2latest.Error, d_update2latest.Parameters>
    export type set_up_comparison_against_published = _pi.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
    export type update_package_dependencies = _pi.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>

}