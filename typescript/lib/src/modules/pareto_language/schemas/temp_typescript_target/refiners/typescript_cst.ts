import * as p_ from 'pareto-core/refiner'
import * as p_temp from 'pareto-core/transformer'
import * as p_schema from 'pareto-core/schema'
import p_variables from "pareto-core/refiner/specials/variables"

import * as s_out from "../schema.js"
import * as s_in from "pareto-typescript/schemas/concrete_syntax_tree/schema"
import * as s_error from "../../pareto_language_from_typescript_directory/schema.js"

namespace declarations {
    export type Block = p_.Refiner<
        s_out.Block,
        s_error.Unexpected_Construct_Error,
        s_in.Block
    >
    export type Expression = p_.Refiner<
        s_out.Expression,
        s_error.Unexpected_Construct_Error,
        s_in.Expression
    >
    export type Statement = p_.Refiner<
        s_out.Statements.L,
        s_error.Unexpected_Construct_Error,
        s_in.Statement
    >
    export type Type = p_.Refiner<
        s_out.Type,
        s_error.Unexpected_Construct_Error,
        s_in.Type
    >

}

//dependencies
import * as t_cst_to_location from "pareto-typescript/schemas/concrete_syntax_tree/transformers/location"


import * as s_loc_temp from "pareto-untyped-syntax-tree-api/schemas/untyped_syntax_tree/schema"

namespace t_cst_to_location_temp_declarations {

    export type Binding_Pattern = p_.Refiner<
        s_loc_temp.Location,
        s_error.Unexpected_Construct_Error,
        s_in.Binding_Pattern
    >


}

namespace t_cst_to_location_temp {

    export const Binding_Pattern: t_cst_to_location_temp_declarations.Binding_Pattern = ($, abort) => p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'array binding pattern': return p_.option($, ($) => $['open bracket token'].location)
                case 'identifier': return p_.option($, ($) => $.location)
                case 'number keyword': return p_.option($, ($) => $.location)
                case 'string keyword': return p_.option($, ($) => $.location)
                case 'object binding pattern': return p_.option($, ($) => $['open brace token'].location)
            }
        }
    )

}

export const Block: declarations.Block = ($, abort) => p_.from.list($.statements).map(
    ($) => Statement($, abort)
)

export const Expression: declarations.Expression = ($, abort) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'arrow function': return p_.option($, ($): s_out.Expression => ['arrow function', {
                'parameters': p_.from.state($.parameters).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'with parentheses': return p_.option($, ($) => p_temp.from.list($.parameters.entries).map_optionally(
                                ($): p_schema.Optional_Value<s_out.Function_Parameters.L> => p_.from.state($).decide(
                                    ($) => {
                                        switch ($[0]) {
                                            case 'entry': return p_.option($, ($) => p_.literal.set({
                                                'name': {
                                                    'value': p_variables(
                                                        () => {
                                                            const $v_bp = $.name
                                                            return p_.from.state($.name.type).decide(
                                                                ($) => {
                                                                    switch ($[0]) {
                                                                        case 'identifier': return p_.option($, ($) => $.text)
                                                                        default: return abort({
                                                                            'name': $[0],
                                                                            'location': t_cst_to_location_temp.Binding_Pattern($v_bp, abort)
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    )
                                                },
                                                'type': p_.from.optional($.type).map(
                                                    ($) => Type($.type, abort)
                                                ),
                                            }))
                                            case 'separator': return p_.option($, ($) => p_.literal.not_set())
                                            default: return p_.exhaustive($[0])
                                        }
                                    }
                                )
                            ))
                            case 'without parentheses': return p_.option($, ($) => abort({
                                'name': "without parentheses",
                                'location': t_cst_to_location_temp.Binding_Pattern($.parameter.name, abort)
                            }))
                            default: return p_.exhaustive($[0])
                        }
                    }
                ),
                'return type': p_.from.optional($.type).map(
                    ($) => p_.from.state($.kind).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'type': return p_.option($, ($) => Type($, abort))
                                case 'type predicate': return p_.option($, ($) => abort({
                                    'name': "type predicate",
                                    'location': p_.from.state($['parameter name']).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'identifier': return p_.option($, ($) => $.location)
                                                case 'this': return p_.option($, ($) => $.location)
                                                default: return p_.exhaustive($[0])
                                            }
                                        }
                                    )
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )
                ),
                'body': p_.from.state($.body).decide(
                    ($): s_out.Expression.arrow_function.body => {
                        switch ($[0]) {
                            case 'block': return p_.option($, ($) => ['block', Block($, abort)])
                            case 'expression': return p_.option($, ($) => ['expression', Expression($, abort)])
                            default: return p_.exhaustive($[0])
                        }
                    }
                )
            }])
            default: return abort({
                'name': $[0],
                'location': t_cst_to_location.Expression($)
            })
        }
    }
)
export const Statement: declarations.Statement = ($, abort) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            default: return abort({
                'name': $[0],
                'location': t_cst_to_location.Statement($)
            })
        }
    }
)

export const Type: declarations.Type = ($, abort) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            default: return abort({
                'name': $[0],
                'location': t_cst_to_location.Type($)
            })
        }
    }
)
