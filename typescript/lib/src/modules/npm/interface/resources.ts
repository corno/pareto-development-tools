import * as _pqi from 'pareto-core/dist/query_interface'
import * as _pci from 'pareto-core/dist/command_interface'

import * as d_npm from "./to_be_generated/npm_tool"
import * as d_npm_publish from "./to_be_generated/npm_publish"
import * as d_update2latest from "./to_be_generated/update2latest"
import * as d_set_up_comparison_against_published from "./to_be_generated/set_up_comparison_against_published"
import * as d_update_package_dependencies from "./to_be_generated/update_package_dependencies"
import * as d_get_package_json from "./to_be_generated/get_package_json"

export namespace commands {

    export type npm = _pci.Command<d_npm.Error, d_npm.Parameters>
    export type npm_publish = _pci.Command<d_npm_publish.Error, d_npm_publish.Parameters>
    export type update2latest = _pci.Command<d_update2latest.Error, d_update2latest.Parameters>
    export type set_up_comparison_against_published = _pci.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>
    export type update_package_dependencies = _pci.Command<d_update_package_dependencies.Error, d_update_package_dependencies.Parameters>

}

export namespace queries {

    export type get_package_json = _pqi.Query<d_get_package_json.Result, d_get_package_json.Error, d_get_package_json.Parameters>
}