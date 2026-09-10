import * as p_ from 'pareto-core/refiner'
import * as p_t from 'pareto-core/transformer'
import type * as p_di from 'pareto-core/schema'
import type * as p_ri from 'pareto-core/refiner'
import p_change_context from 'pareto-core/refiner/specials/change_context'

//schemas
import type * as s_in from "astn-core/modules/deserialization/schemas/parse_tree/schema"

//dependencies

export type Error_Expect_Object =
    | ['not an object', null]
    | ['duplicate identifier', string]
    | ['missing value', null]

export type Object_ = p_di.Dictionary<s_in.Value>