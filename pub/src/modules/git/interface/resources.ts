import * as _pi from 'pareto-core/dist/interface'

import * as d_assert_is_clean from "./to_be_generated/assert_is_clean"
import * as d_is_repository_clean from "./to_be_generated/is_repository_clean"
import * as d_is_inside_work_tree from "./to_be_generated/is_inside_work_tree"
import * as d_make_pristine from "./to_be_generated/make_pristine"
import * as d_push from "./to_be_generated/push"
import * as d_extended_commit from "./to_be_generated/extended_commit"
import * as d_remove_tracked_but_ignored from "./to_be_generated/remove_tracked_but_ignored"

export namespace commands {

    export type assert_is_clean = _pi.Command<d_assert_is_clean.Error, d_assert_is_clean.Parameters>
    export type make_pristine = _pi.Command<d_make_pristine.Error, d_make_pristine.Parameters>
    export type extended_commit = _pi.Command<d_extended_commit.Error, d_extended_commit.Parameters>
    export type push = _pi.Command<d_push.Error, d_push.Parameters>
    export type remove_tracked_but_ignored = _pi.Command<d_remove_tracked_but_ignored.Error, d_remove_tracked_but_ignored.Parameters>

}

export namespace queries {

    export type is_repository_clean = _pi.Query<d_is_repository_clean.Result, d_is_repository_clean.Error, d_is_repository_clean.Parameters>
    export type is_inside_work_tree = _pi.Query<d_is_inside_work_tree.Result, d_is_inside_work_tree.Error, d_is_inside_work_tree.Parameters>

}