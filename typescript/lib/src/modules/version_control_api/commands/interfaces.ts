import * as p_ from 'pareto-core/command_interface'

//schemas
import type * as s_assert_no_open_changes from "../schemas/assert_no_open_changes/schema.js"
import type * as s_make_pristine from "../schemas/make_pristine/schema.js"
import type * as s_push from "../schemas/push/schema.js"
import type * as s_extended_commit from "../schemas/extended_commit/schema.js"

export type assert_no_open_changes = p_.Command_Interface<
    s_assert_no_open_changes.Error,
    s_assert_no_open_changes.Parameters
>
export type make_pristine = p_.Command_Interface<
    s_make_pristine.Error,
    s_make_pristine.Parameters
>
export type extended_commit = p_.Command_Interface<
    s_extended_commit.Error,
    s_extended_commit.Parameters
>
export type push = p_.Command_Interface<
    s_push.Error,
    s_push.Parameters
>
