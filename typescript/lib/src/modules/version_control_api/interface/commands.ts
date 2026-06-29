import * as p_ from 'pareto-core/dist/interface/command'

//data types
import * as d_assert_no_open_changes from "./data/assert_no_open_changes"
import * as d_make_pristine from "./data/make_pristine"
import * as d_push from "./data/push"
import * as d_extended_commit from "./data/extended_commit"

export namespace commands {

    export type assert_no_open_changes = p_.Command<d_assert_no_open_changes.Error, d_assert_no_open_changes.Parameters>
    export type make_pristine = p_.Command<d_make_pristine.Error, d_make_pristine.Parameters>
    export type extended_commit = p_.Command<d_extended_commit.Error, d_extended_commit.Parameters>
    export type push = p_.Command<d_push.Error, d_push.Parameters>

}
