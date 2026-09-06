import * as p_ from 'pareto-core/refiner'
import * as p_temp from 'pareto-core/transformer'
import * as p_schema from 'pareto-core/schema'
import p_variables from "pareto-core/refiner/specials/variables"
import p_unreachable_code_path from "pareto-core/transformer/specials/unreachable_code_path"

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

    export type Binding_Pattern = p_temp.Transformer<
        s_in.Binding_Pattern,
        s_loc_temp.Location
    >
    export type Property_Name = p_temp.Transformer<
        s_in.Property_Name,
        s_loc_temp.Location
    >


}

namespace t_cst_to_location_temp {

    export const Binding_Pattern: t_cst_to_location_temp_declarations.Binding_Pattern = ($) => p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'array binding pattern': return p_.option($, ($) => $['open bracket token'].location)
                case 'identifier': return p_.option($, ($) => $.location)
                case 'number keyword': return p_.option($, ($) => $.location)
                case 'string keyword': return p_.option($, ($) => $.location)
                case 'object binding pattern': return p_.option($, ($) => $['open brace token'].location)
                default: return p_.exhaustive($)
            }
        }
    )
    export const Property_Name: t_cst_to_location_temp_declarations.Property_Name = ($) => p_.from.state($.type).decide(
        ($) => {
            switch ($[0]) {
                case 'identifier': return p_.option($, ($) => $.location)
                case 'big int literal': return p_.option($, ($) => $.location)
                case 'computed': return p_.option($, ($) => $['open bracket token'].location)
                case 'numeric literal': return p_.option($, ($) => $.location)
                case 'private identifier': return p_.option($, ($) => $.location)
                case 'string literal': return p_.option($, ($) => $.location)
                default: return p_.exhaustive($)
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
            case 'array literal': return p_.option($, ($): s_out.Expression => ['array literal', p_temp.from.list($.elements.entries).map(
                ($) => Expression($.data, abort)
            )])
            case 'arrow function': return p_.option($, ($): s_out.Expression => ['arrow function', {
                'parameters': p_.from.state($.parameters).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'with parentheses': return p_.option($, ($) => p_temp.from.list($.parameters.entries.entries).map(
                                ($) => ({
                                    'name': {
                                        'value': p_variables(
                                            () => {
                                                const $v_bp = $.data.name
                                                return p_.from.state($.data.name.type).decide(
                                                    ($) => {
                                                        switch ($[0]) {
                                                            case 'identifier': return p_.option($, ($) => $.text)
                                                            default: return abort({
                                                                'name': $[0],
                                                                'location': t_cst_to_location_temp.Binding_Pattern($v_bp,)
                                                            })
                                                        }
                                                    }
                                                )
                                            }
                                        )
                                    },
                                    'type': p_.from.optional($.data.type).map(
                                        ($) => Type($.type, abort)
                                    ),
                                })
                            ))
                            case 'without parentheses': return p_.option($, ($) => abort({
                                'name': "without parentheses",
                                'location': t_cst_to_location_temp.Binding_Pattern($.parameter.name)
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
            case 'binary': return p_.option($, ($): s_out.Expression => ['compare', {
                'left': Expression($['left'], abort),
                'operator': p_variables(() => {
                    const $v_operator_token = $['operator token']
                    return p_.from.state($['operator token']).decide(
                        ($) => {
                            switch ($[0]) {
                                case '===': return p_.option($, ($) => ['strictly equal', null])
                                case '!==': return p_.option($, ($) => ['strictly not equal', null])
                                case '<': return p_.option($, ($) => ['smaller than', null])
                                case '<=': return p_.option($, ($) => ['smaller than or equal', null])
                                case '>': return p_.option($, ($) => ['greater than', null])
                                case '>=': return p_.option($, ($) => ['greater than or equal', null])

                                //fix these
                                case '&&': return p_.option($, ($) => ['strictly not equal', null])
                                case '||': return p_.option($, ($) => ['strictly not equal', null])
                                case '+': return p_.option($, ($) => ['strictly not equal', null])
                                case '-': return p_.option($, ($) => ['strictly not equal', null])
                                default: return abort({
                                    'name': $[0],
                                    'location': p_.from.state($v_operator_token).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case '===': return p_.option($, ($) => $.location)
                                                case '!==': return p_.option($, ($) => $.location)
                                                case '!=': return p_.option($, ($) => $.location)
                                                case '<': return p_.option($, ($) => $.location)
                                                case '<=': return p_.option($, ($) => $.location)
                                                case '>': return p_.option($, ($) => $.location)
                                                case '>=': return p_.option($, ($) => $.location)
                                                case '%': return p_.option($, ($) => $.location)
                                                case '+': return p_.option($, ($) => $.location)
                                                case '-': return p_.option($, ($) => $.location)
                                                case '*': return p_.option($, ($) => $.location)
                                                case '/': return p_.option($, ($) => $.location)
                                                case '**': return p_.option($, ($) => $.location)
                                                case '<<': return p_.option($, ($) => $.location)
                                                case '>>': return p_.option($, ($) => $.location)
                                                case '>>>': return p_.option($, ($) => $.location)
                                                case '&': return p_.option($, ($) => $.location)
                                                case '|': return p_.option($, ($) => $.location)
                                                case '^': return p_.option($, ($) => $.location)
                                                case '%=': return p_.option($, ($) => $.location)
                                                case '+=': return p_.option($, ($) => $.location)
                                                case '-=': return p_.option($, ($) => $.location)
                                                case '*=': return p_.option($, ($) => $.location)
                                                case '/=': return p_.option($, ($) => $.location)
                                                case '**=': return p_.option($, ($) => $.location)
                                                case '<<=': return p_.option($, ($) => $.location)
                                                case '>>=': return p_.option($, ($) => $.location)
                                                case '>>>=': return p_.option($, ($) => $.location)
                                                case '&=': return p_.option($, ($) => $.location)
                                                case '|=': return p_.option($, ($) => $.location)
                                                case '^=': return p_.option($, ($) => $.location)
                                                case '&&=': return p_.option($, ($) => $.location)
                                                case '||=': return p_.option($, ($) => $.location)
                                                case '&&': return p_.option($, ($) => $.location)
                                                case '||': return p_.option($, ($) => $.location)
                                                case ',': return p_.option($, ($) => $.location)
                                                case '=': return p_.option($, ($) => $.location)
                                                case '==': return p_.option($, ($) => $.location)
                                                case '===': return p_.option($, ($) => $.location)
                                                case '!=': return p_.option($, ($) => $.location)
                                                case '!==': return p_.option($, ($) => $.location)
                                                case '<': return p_.option($, ($) => $.location)
                                                case '<=': return p_.option($, ($) => $.location)
                                                case '>': return p_.option($, ($) => $.location)
                                                case '>=': return p_.option($, ($) => $.location)
                                                case 'in': return p_.option($, ($) => $.location)
                                                case 'instanceof': return p_.option($, ($) => $.location)
                                                case '??': return p_.option($, ($) => $.location)
                                                case '??=': return p_.option($, ($) => $.location)
                                                default: return p_.exhaustive($[0])
                                            }
                                        }
                                    )
                                })
                            }
                        }
                    )
                }),
                'right': Expression($['right'], abort),
            }])
            case 'call': return p_.option($, ($): s_out.Expression => ['call', {
                'function selection': p_.from.state($.callee).decide(
                    ($) => {
                        switch ($[0]) {
                            case 'expression': return p_.option($, ($) => Expression($, abort))
                            case 'import': return p_.option($, ($) => abort({
                                'name': "import",
                                'location': $.location
                            }))
                            case 'super': return p_.option($, ($) => abort({
                                'name': "super",
                                'location': $.location
                            }))
                            default: return p_.exhaustive($[0])
                        }
                    }
                ),
                'arguments': p_temp.from.list($.arguments.arguments.entries).map(
                    ($) => p_.from.state($.data).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'expression': return p_.option($, ($) => Expression($, abort))
                                case 'spread': return p_.option($, ($) => abort({
                                    'name': "spread",
                                    'location': $['dot dot dot token'].location
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )
                )
            }])
            case 'conditional': return p_.option($, ($): s_out.Expression => ['conditional', {
                'condition': Expression($['condition'], abort),
                'if true': Expression($['when true'], abort),
                'if false': Expression($['when false'], abort),
            }])
            case 'element access': return p_.option($, ($): s_out.Expression => ['element access', {
                'collection': Expression($.expression, abort),
                'index': Expression($['argument expression'], abort)
            }])
            case 'false': return p_.option($, ($): s_out.Expression => ['false', null])
            case 'identifier': return p_.option($, ($): s_out.Expression => ['identifier', {
                'value': $.text
            }])
            case 'null keyword': return p_.option($, ($): s_out.Expression => ['null', null])
            case 'numeric literal': return p_.option($, ($): s_out.Expression => ['number literal', $.text === "0"
                ? 0
                : $.text === "1"
                    ? 1
                    : 999999999999 //FIX needs parsing
            ])
            case 'object literal': return p_.option($, ($): s_out.Expression => ['object literal', {
                'properties': p_temp.from.list($.properties.entries).map(
                    ($) => p_.from.state($.data).decide(
                        ($): s_out.Expression.object_literal.properties.L => {
                            switch ($[0]) {
                                case 'property': return p_.option($, ($): s_out.Expression.object_literal.properties.L => ({
                                    'key': p_.from.state($.name.type).decide(
                                        ($) => {
                                            switch ($[0]) {
                                                case 'identifier': return p_.option($, ($) => ['identifier', {
                                                    'value': $.text
                                                }])
                                                case 'string literal': return p_.option($, ($) => ['string literal', {
                                                    'value': $.text,
                                                    'delimiter': ['apostrophe', null] //FIXME
                                                }])
                                                case 'big int literal': return p_.option($, ($) => abort({
                                                    'name': "big int literal",
                                                    'location': $.location
                                                }))
                                                case 'computed': return p_.option($, ($) => abort({
                                                    'name': "computed",
                                                    'location': $['open bracket token'].location
                                                }))
                                                case 'numeric literal': return p_.option($, ($) => abort({
                                                    'name': "numeric literal",
                                                    'location': $.location
                                                }))
                                                case 'private identifier': return p_.option($, ($) => abort({
                                                    'name': "private identifier",
                                                    'location': $.location
                                                }))
                                                default: return p_.exhaustive($[0])
                                            }
                                        }
                                    ),
                                    'value': Expression($.initializer, abort)
                                }))
                                case 'spread': return p_.option($, ($) => abort({
                                    'name': "spread",
                                    'location': $['dot dot dot token'].location
                                }))
                                case 'get accessor': return p_.option($, ($) => abort({
                                    'name': "get accessor",
                                    'location': $['get keyword'].location
                                }))
                                case 'set accessor': return p_.option($, ($) => abort({
                                    'name': "set accessor",
                                    'location': $['set keyword'].location
                                }))
                                case 'method': return p_.option($, ($) => abort({
                                    'name': "method",
                                    'location': t_cst_to_location_temp.Property_Name($.name)
                                }))
                                case 'shorthand property': return p_.option($, ($) => abort({
                                    'name': "shorthand property",
                                    'location': $.name.location
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )
                )
            }])
            case 'parenthesized': return p_.option($, ($): s_out.Expression => ['parenthesized', Expression($.expression, abort)])
            case 'property access': return p_.option($, ($): s_out.Expression => ['property access', {
                'object': Expression($.expression, abort),
                'property': {
                    'value': p_.from.state($.identifier).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'named': return p_.option($, ($) => $.text)
                                case 'private': return p_.option($, ($) => abort({
                                    'name': "private",
                                    'location': $.location
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )
                },
            }])
            case 'string literal': return p_.option($, ($): s_out.Expression => ['string literal', {
                'value': $.text,
                'delimiter': ['quote', null], //FIXME
            }])
            case 'true keyword': return p_.option($, ($): s_out.Expression => ['true', null])
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
            case 'return': return p_.option($, ($): s_out.Statements.L => ['return', p_.from.optional($.expression).map(
                ($) => Expression($, abort)
            )])
            case 'switch': return p_.option($, ($): s_out.Statements.L => ['switch', {
                'expression': Expression($.expression, abort),
                'clauses': p_.from.list($['case block'].clauses).map(
                    ($) => p_.from.state($).decide(
                        ($) => {
                            switch ($[0]) {
                                case 'case': return p_.option($, ($): s_out.Statements.L.switch_.clauses.L => ({
                                    'type': ['case', Expression($.expression, abort)],
                                    'statements': p_.from.list($.statements).map(
                                        ($) => Statement($, abort)
                                    )
                                }))
                                case 'default': return p_.option($, ($): s_out.Statements.L.switch_.clauses.L => ({
                                    'type': ['default', null],
                                    'statements': p_.from.list($.statements).map(
                                        ($) => Statement($, abort)
                                    )
                                }))
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )
                )
            }])
            case 'variable': return p_.option($, ($): s_out.Statements.L => ['variable', p_temp.from.list($['variable declaration list'].declarations.entries).on_has_single_item(
                ($) => ({
                    'const': true,
                    'export': false,
                    'expression': p_.from.optional($.data.assignment).map(
                        ($) => Expression($.initializer.expression, abort)
                    ),
                    'name': p_variables(
                        () => {
                            const $v_bp = $.data.name
                            return p_.from.state($.data.name.type).decide(
                                ($) => {
                                    switch ($[0]) {
                                        case 'identifier': return p_.option($, ($) => ({
                                            'value': $.text
                                        }))
                                        default: return abort({
                                            'location': t_cst_to_location_temp.Binding_Pattern($v_bp),
                                            'name': $[0]
                                        })
                                    }
                                }
                            )
                        }
                    ),
                    'type': p_.from.optional($.data.type).map(
                        ($) => Type($.type, abort)
                    ),
                }),
                ($) => abort({
                    'name': "unexpected",
                    'location': p_temp.from.list($).on_has_first_item(
                        ($) => t_cst_to_location_temp.Binding_Pattern($.data.name),
                        ($) => p_unreachable_code_path("we're in the multiple items handler")
                    )
                }),
                () => p_unreachable_code_path("Expected at least one variable in a variable declaration list"),
            )])
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
            case 'boolean': return p_.option($, ($): s_out.Type => ['boolean', null])
            case 'string': return p_.option($, ($): s_out.Type => ['string', null])
            case 'literal type': return p_.option($, ($): s_out.Type => ['literal type', {
                'value': p_variables(
                    () => {
                        const $v_lit_type = $
                        return p_.from.state($.type).decide(
                            ($) => {
                                switch ($[0]) {
                                    case 'string literal': return p_.option($, ($) => $.text)
                                    default: return abort({
                                        'name': $[0],
                                        'location': p_.from.state($v_lit_type.type).decide(
                                            ($) => {
                                                switch ($[0]) {
                                                    case 'no substitution template literal': return p_.option($, ($) => $.location)
                                                    case 'numeric literal': return p_.option($, ($) => $.location)
                                                    case 'string literal': return p_.option($, ($) => $.location)
                                                    case 'true keyword': return p_.option($, ($) => $.location)
                                                    case 'bigint literal': return p_.option($, ($) => $.location)
                                                    case 'false keyword': return p_.option($, ($) => $.location)
                                                    case 'negative numeric literal': return p_.option($, ($) => $['minus token'].location)
                                                    case 'null': return p_.option($, ($) => $.location)
                                                    default: return p_.exhaustive($[0])
                                                }
                                            }
                                        )
                                    })
                                }
                            }
                        )
                    }
                ),
                'delimiter': ['apostrophe', null],
            }])
            case 'number': return p_.option($, ($): s_out.Type => ['number', null])
            case 'type reference': return p_.option($, ($): s_out.Type => ['type reference', {
                'start': p_.from.state($['entity name']).decide(
                    ($): s_out.Type.type_reference.start => {
                        switch ($[0]) {
                            case 'identifier': return p_.option($, ($) => ({
                                'value': $.text
                            }))
                            case 'qualified name': return p_.option($, ($) => ({
                                'value': "FIXME"
                            }))
                            default: return p_.exhaustive($[0])
                        }
                    },
                ),
                'tail': p_.from.state($['entity name']).decide(
                    ($): s_out.Type.type_reference.tail => {
                        switch ($[0]) {
                            case 'identifier': return p_.option($, ($) => p_.literal.list([]))
                            case 'qualified name': return p_.option($, ($) => p_.literal.list([
                                {
                                    'value': "FIXME"
                                }
                            ])) //FIXME
                            default: return p_.exhaustive($[0])
                        }
                    },
                ),
                'type arguments': p_.from.optional($['type arguments']).decide(
                    ($) => p_temp.from.list($.entries.entries).map(
                        ($) => Type($.data, abort)
                    ),
                    () => p_.literal.list([])
                ),
            }])
            case 'union type': return p_.option($, ($): s_out.Type => ['union', p_.from.list($.members.entries).map(
                ($) => Type($.data, abort)
            )])
            default: return abort({
                'name': $[0],
                'location': t_cst_to_location.Type($)
            })
        }
    }
)
