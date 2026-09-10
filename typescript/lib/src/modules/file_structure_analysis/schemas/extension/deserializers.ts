import * as p_ from 'pareto-core/deserializer'
import * as p_r from 'pareto-core/refiner'
import p_list_from_text from 'pareto-core/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/transformer/specials/text_from_list'

import * as s_out from "./schema.js"

//schemas
namespace declarations {
    export type extension = p_.Deserializer_Without_Error<
        s_out.Possible_Extension
    >
}

export const extension: declarations.extension = ($) => {
    const $v_characters = p_list_from_text(
        $,
        ($) => $
    )

    let first_period_index: null | number = null
    let current_index = 0
    p_r.from.list($v_characters).map(
        ($) => {
            if ($ === 46) { //period
                first_period_index = current_index
            }
            current_index++
            return null
        })
    if (first_period_index === null) {
        return p_r.literal.not_set()
    } else {
        const fpi: number = first_period_index
        current_index = 0
        return p_r.literal.set(
            p_text_from_list(
                p_list_build_deprecated<number>(
                    ($i) => {
                        p_r.from.list($v_characters).map(
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