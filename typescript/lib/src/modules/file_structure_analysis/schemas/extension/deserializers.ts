import * as p_ from 'pareto-core/refiner'
import type * as p_di from 'pareto-core/schema'

import p_list_from_text from 'pareto-core/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/transformer/specials/text_from_list'

//schemas
namespace declarations {
    export type extension = p_.Refiner_Without_Error<
        p_di.Optional_Value<string>,
        string
    >
}

export const extension: declarations.extension = ($) => {
    const $v_characters = p_list_from_text(
        $,
        ($) => $
    )

    let first_period_index: null | number = null
    let current_index = 0
    p_.from.list($v_characters).map(
        ($) => {
            if ($ === 46) { //period
                first_period_index = current_index
            }
            current_index++
            return null
        })
    if (first_period_index === null) {
        return p_.literal.not_set()
    } else {
        const fpi: number = first_period_index
        current_index = 0
        return p_.literal.set(
            p_text_from_list(
                p_list_build_deprecated<number>(
                    ($i) => {
                        p_.from.list($v_characters).map(
                            ($) => {
                                if (current_index > fpi) {
                                    $i['add item']($)
                                }
                                current_index++
                                return null
                            })
                    }),
                ($) => $
            )
        )
    }
}