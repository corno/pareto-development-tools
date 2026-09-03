import * as p_ from 'pareto-core/implementation/query'
import p_super_query_result from 'pareto-core/implementation/query/super_query_result'

import type * as query_typescript_api from "pareto-typescript/queries/interfaces"

//schemas
import type * as s_get_typescript_files from "../../schemas/get_typescript_files/schema.js"


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
    ($d, $s, $q) => p_.e.dictionary(
        $d,
        ($): p_.Query_Result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error> => p_.decide.state(
            $,
            ($) => {
                switch ($[0]) {
                    case 'directory': return p_.ss($, ($): p_.Query_Result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error> => p_super_query_result(
                        $$(null, $q)(
                            $,
                            ($): s_get_typescript_files.Node_Error => ['directory', $],
                        ),
                    ).transform(
                        ($) => ['directory', $]
                    ))
                    case 'file': return p_.ss($, ($): p_.Query_Result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error> => p_super_query_result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error>(
                        p_.e.observe_behavior(
                            $q['parse typescript file'](
                                $,
                                ($) => $
                            ),
                            {
                                'error': ($): p_.Query_Result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error> => p_.e.direct_result(['file', ['failure', $]]),
                                'success': ($): p_.Query_Result<s_get_typescript_files.Node, s_get_typescript_files.Node_Error> => p_.e.direct_result(['file', ['success', $['source file']]]),
                            }
                        )
                    ).transform(
                        ($): s_get_typescript_files.Node => $
                    ))
                    case 'other': return p_.ss($, ($) => p_.e.direct_result(['other', null]))
                    default: return p_.au($[0])
                }
            }
        ),
        ($) => $
    )
)