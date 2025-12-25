import * as _et from 'exupery-core-types'

import * as d_npm from "./to_be_generated/npm"
import * as d_update2latest from "./to_be_generated/update2latest"
import * as d_set_up_comparison_against_published from "./to_be_generated/set_up_comparison_against_published"

export namespace commands {

    export type npm = _et.Command<d_npm.Error, d_npm.Parameters>
    export type update2latest = _et.Command<d_update2latest.Error, d_update2latest.Parameters>
    export type set_up_comparison_against_published = _et.Command<d_set_up_comparison_against_published.Error, d_set_up_comparison_against_published.Parameters>

}