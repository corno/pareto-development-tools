import * as p_ from 'pareto-core/query'
import p_super_query_result from 'pareto-core/query/super_query_result'

import type * as query_typescript_api from "pareto-typescript/queries/interfaces"

//schemas
import type * as s_get_typescript_files from "../../schemas/get_typescript_files/schema.js"
import type * as s_typescript_directory from "../../schemas/typescript_directory/schema.js"


//dependencies

export const $$: p_.Query_Implementation<
    p_.Query_Interface<
        s_get_typescript_files.Result,
        s_get_typescript_files.Error,
        s_get_typescript_files.Parameters
    >,
    null,
    {
        'parse typescript file': query_typescript_api.parse_file,
    }
> = p_.query(
    (e, $s, $q, $d) => p_.e_deprecated.dictionary(
        $d.deprecated,
        ($): p_.Query_Result<s_typescript_directory.Node, s_get_typescript_files.Node_Error> => p_.decide.state(
            $,
            ($) => {
                switch ($[0]) {
                    case 'directory': return p_.option($, ($): p_.Query_Result<s_typescript_directory.Node, s_get_typescript_files.Node_Error> => p_super_query_result(
                        $$(null, $q)(
                            $,
                            ($): s_get_typescript_files.Node_Error => ['directory', $],
                        ),
                    ).transform(
                        ($) => ['directory', $]
                    ))
                    case 'file': return p_.option($, ($): p_.Query_Result<s_typescript_directory.Node, s_get_typescript_files.Node_Error> => p_super_query_result<s_typescript_directory.Node, s_get_typescript_files.Node_Error>(
                        p_.e_deprecated.observe_behavior(
                            $q['parse typescript file'](
                                $,
                                ($) => $
                            ),
                            {
                                'error': ($): p_.Query_Result<s_typescript_directory.Node, s_get_typescript_files.Node_Error> => p_.e_deprecated.direct_result(['file', ['failure', $]]),
                                'success': ($): p_.Query_Result<s_typescript_directory.Node, s_get_typescript_files.Node_Error> => p_.e_deprecated.direct_result(['file', ['success', $['source file']]]),
                            }
                        )
                    ).transform(
                        ($): s_typescript_directory.Node => $
                    ))
                    case 'other': return p_.option($, ($) => p_.e_deprecated.direct_result(['other', null]))
                    default: return p_.exhaustive($[0])
                }
            }
        ),
        ($) => $
    )
)