import * as p_ from 'pareto-core/refiner'
import * as p_t from 'pareto-core/transformer'
import type * as p_di from 'pareto-core/schema'
import type * as p_ri from 'pareto-core/refiner'
import p_change_context from 'pareto-core/refiner/specials/change_context'

//schemas
import type * as s_in from "astn-core/modules/deserialization/schemas/parse_tree/schema"
import type * as s_out from "../schema.js"
import type * as s_error from "../../deserialize_package_json/schema.js"

//dependencies
import * as r_temp_unmashalled_json_value_from_parse_tree from "../../temp_unmarshalled_json_value/refiners/parse_tree.js"

export const NPM_Package: p_ri.Refiner<
    s_out.NPM_Package,
    s_error.Error['type'],
    s_in.Document
> = ($, abort) => {

    return p_change_context(
        r_temp_unmashalled_json_value_from_parse_tree.Object_(
            $.content,
            ($) => abort(['missing root object', null])
        ),
        ($) => {

            const $p_name = r_temp_unmashalled_json_value_from_parse_tree.Text(
                r_temp_unmashalled_json_value_from_parse_tree.Property(
                    $,
                    ($) => abort(['name', ['missing', null]]),
                    {
                        'id': "name",
                    }
                ),
                (error) => abort(['name', ['not a text', null]])
            )

            const $p_version = r_temp_unmashalled_json_value_from_parse_tree.Text(
                r_temp_unmashalled_json_value_from_parse_tree.Property(
                    $,
                    ($) => abort(['version', ['missing', null]]),
                    {
                        'id': "version",
                    }
                ),
                (error) => abort(['version', ['not a text', null]])
            )

            return {
                'name': $p_name,
                'version': $p_version,
                'dependencies': p_t.from.dictionary($).get_possible_entry(
                    "dependencies",
                    ($) => p_.literal.set(p_change_context(
                        r_temp_unmashalled_json_value_from_parse_tree.Object_(
                            $,
                            ($) => abort(['dependencies', ['not an object', null]])
                        ),
                        ($) => p_.from.dictionary($).map(
                            ($, id) => r_temp_unmashalled_json_value_from_parse_tree.Text(
                                $,
                                ($) => abort(['dependencies', ['not a text', id]])
                            )
                        )
                    )),
                    () => p_.literal.not_set()
                ),
            }
        }
    )

}