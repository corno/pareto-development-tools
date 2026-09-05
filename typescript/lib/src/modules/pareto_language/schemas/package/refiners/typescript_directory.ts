import * as p_ from 'pareto-core/refiner'
import * as p_temp from 'pareto-core/transformer'
import * as p_schema from 'pareto-core/schema'

import * as s_out from "../schema.js"
import * as s_in from "../../typescript_directory/schema.js"
import * as s_error from "../../pareto_language_from_typescript_directory/schema.js"


export namespace declarations {

    export type Package = p_.Refiner<
        s_out.Package,
        s_error.Error,
        s_in.Directory
    >

}

//dependencies
import * as t_cst_to_location from "pareto-typescript/schemas/concrete_syntax_tree/transformers/location"
import * as r_temp_typescript_from_cst from "../../temp_typescript_target/refiners/typescript_cst.js"


export const Package: declarations.Package = ($, abort) => {

    const ts_dir = p_.from.dictionary($).get_entry(
        "typescript",
        {
            'no_such_entry': ($) => abort(['no such node', {
                'internal path': "/",
                'name': "typescript",
            }])
        }
    )
    if (ts_dir[0] !== 'directory') {
        return abort(['not a directory', {
            'internal path': "/",
            'name': "typescript",
        }])
    }

    const lib_dir = p_.from.dictionary(ts_dir[1]).get_entry(
        "lib",
        {
            'no_such_entry': ($) => abort(['no such node', {
                'internal path': "/typescript",
                'name': "lib",
            }])
        }
    )
    if (lib_dir[0] !== 'directory') {
        return abort(['not a directory', {
            'internal path': "/typescript",
            'name': "lib",
        }])
    }
    const src_dir = p_.from.dictionary(lib_dir[1]).get_entry(
        "src",
        {
            'no_such_entry': ($) => abort(['no such node', {
                'internal path': "/typescript/lib",
                'name': "src",
            }])
        }
    )
    if (src_dir[0] !== 'directory') {
        return abort(['not a directory', {
            'internal path': "/typescript/lib",
            'name': "src",
        }])
    }
    const globals_file = p_.from.dictionary(src_dir[1]).get_entry(
        "globals.ts",
        {
            'no_such_entry': ($) => abort(['no such node', {
                'internal path': "/typescript/lib/src",
                'name': "globals.ts",
            }])
        }
    )
    if (globals_file[0] !== 'file') {
        return abort(['not a file', {
            'internal path': "/typescript/lib/src",
            'name': "globals.ts",
        }])
    }

    const index_file = p_.from.dictionary(src_dir[1]).get_entry(
        "index.ts",
        {
            'no_such_entry': ($) => abort(['no such node', {
                'internal path': "/typescript/lib/src",
                'name': "index.ts",
            }])
        }
    )
    if (index_file[0] !== 'file') {
        return abort(['not a file', {
            'internal path': "/typescript/lib/src",
            'name': "index.ts",
        }])
    }

    const schemas_dir = p_.from.dictionary(src_dir[1]).get_possible_entry(
        "schemas",
    )
    const schemas: s_out.Schemas = p_.from.optional(schemas_dir).decide(
        ($): s_out.Schemas => {
            if ($[0] !== 'directory') {
                return abort(['not a directory', {
                    'internal path': "/typescript/lib/src",
                    'name': "schemas",
                }])
            }
            return p_.from.dictionary($[1]).map_and_aggregate_error<s_out.Schema, s_error.Error>(
                ($, id, abort): s_out.Schema => {
                    const schema_id = id
                    if ($[0] !== 'directory') {
                        return abort(['not a directory', {
                            'internal path': "/typescript/lib/src/schemas",
                            'name': id,
                        }])
                    }
                    const schema_file = p_.from.dictionary($[1]).get_entry(
                        "schema.ts",
                        {
                            'no_such_entry': ($) => abort(['no such node', {
                                'internal path': "/typescript/lib/src/schemas/" + id,
                                'name': "schema.ts",
                            }])
                        }
                    )
                    if (schema_file[0] !== 'file') {
                        return abort(['not a file', {
                            'internal path': "/typescript/lib/src/schemas/" + id,
                            'name': "schema.ts",
                        }])
                    }
                    p_.from.state(schema_file[1]).decide(
                        ($): null => {
                            switch ($[0]) {
                                case 'failure': return p_.option($, ($) => abort(['typescript parsing failed', {
                                    'location': {
                                        'internal path': "/typescript/lib/src/schemas/" + id,
                                        'name': "schema.ts"
                                    }
                                }]))
                                case 'success': return p_.option($, ($) => {

                                    p_.from.list($.statements).map_and_aggregate_error<string, s_error.Error>(
                                        ($, abort): string => p_.from.state($).decide(
                                            ($): string => {
                                                switch ($[0]) {
                                                    case 'export declaration': return p_.option($, ($) => "uitwerken")
                                                    case 'import': return p_.option($, ($) => "uitwerken")
                                                    case 'module': return p_.option($, ($) => "uitwerken")
                                                    case 'type alias': return p_.option($, ($) => "uitwerken")
                                                    default: return abort(['unexpected construct', {
                                                        'error': {
                                                            'name': $[0],
                                                            'location': t_cst_to_location.Statement($)
                                                        },
                                                        'file location': {
                                                            'internal path': "/typescript/lib/src/schemas/" + id,
                                                            'name': "schema.ts"
                                                        },
                                                    }])
                                                }
                                            }
                                        ),
                                        ($) => abort(['aggregated', {
                                            'errors': $
                                        }])
                                    )
                                    return null
                                })
                                default: return p_.exhaustive($[0])
                            }
                        }
                    )

                    const serializer_file = p_.from.dictionary($[1]).get_possible_entry(
                        "serializers.ts",
                    )
                    p_.from.optional(serializer_file).map(
                        ($) => {
                            if ($[0] !== 'file') {
                                return abort(['not a file', {
                                    'internal path': "/typescript/lib/src/schemas/" + id,
                                    'name': "serializers.ts",
                                }])
                            }

                            p_.from.state($[1]).decide(
                                ($): null => {
                                    switch ($[0]) {
                                        case 'failure': return p_.option($, ($) => abort(['typescript parsing failed', {
                                            'location': {
                                                'internal path': "/typescript/lib/src/schemas/" + id,
                                                'name': "schema.ts"
                                            }
                                        }]))
                                        case 'success': return p_.option($, ($) => {

                                            p_.from.list($.statements).map_and_aggregate_error<string, s_error.Error>(
                                                ($, abort): string => p_.from.state($).decide(
                                                    ($): string => {
                                                        switch ($[0]) {
                                                            case 'import': return p_.option($, ($) => "uitwerken")
                                                            case 'module': return p_.option($, ($) => "uitwerken")
                                                            case 'variable': return p_.option($, ($) => "uitwerken")
                                                            default: return abort(['unexpected construct', {
                                                                'error': {
                                                                    'name': $[0],
                                                                    'location': t_cst_to_location.Statement($)
                                                                },
                                                                'file location': {
                                                                    'internal path': "/typescript/lib/src/schemas/" + id,
                                                                    'name': "schema.ts"
                                                                },
                                                            }])
                                                        }
                                                    }
                                                ),
                                                ($) => abort(['aggregated', {
                                                    'errors': $
                                                }])
                                            )
                                            return null
                                        })
                                        default: return p_.exhaustive($[0])
                                    }
                                }
                            )
                            return null
                        }
                    )
                    const deserializer_file = p_.from.dictionary($[1]).get_possible_entry(
                        "deserializers.ts",
                    )
                    p_.from.optional(deserializer_file).map(
                        ($) => {
                            if ($[0] !== 'file') {
                                return abort(['not a file', {
                                    'internal path': "/typescript/lib/src/schemas/" + id,
                                    'name': "deserializers.ts",
                                }])
                            }

                            p_.from.state($[1]).decide(
                                ($): null => {
                                    switch ($[0]) {
                                        case 'failure': return p_.option($, ($) => abort(['typescript parsing failed', {
                                            'location': {
                                                'internal path': "/typescript/lib/src/schemas/" + id,
                                                'name': "deserializers.ts"
                                            }
                                        }]))
                                        case 'success': return p_.option($, ($) => {

                                            p_.from.list($.statements).map_and_aggregate_error<string, s_error.Error>(
                                                ($, abort): string => p_.from.state($).decide(
                                                    ($): string => {
                                                        switch ($[0]) {
                                                            case 'import': return p_.option($, ($) => "uitwerken")
                                                            case 'module': return p_.option($, ($) => "uitwerken")
                                                            case 'variable': return p_.option($, ($) => "uitwerken")
                                                            default: return abort(['unexpected construct', {
                                                                'error': {
                                                                    'name': $[0],
                                                                    'location': t_cst_to_location.Statement($)
                                                                },
                                                                'file location': {
                                                                    'internal path': "/typescript/lib/src/schemas/" + id,
                                                                    'name': "deserializers.ts"
                                                                },
                                                            }])
                                                        }
                                                    }
                                                ),
                                                ($) => abort(['aggregated', {
                                                    'errors': $
                                                }])
                                            )
                                            return null
                                        })
                                        default: return p_.exhaustive($[0])
                                    }
                                }
                            )
                            return null
                        }
                    )


                    const transformers_dir = p_.from.dictionary($[1]).get_possible_entry(
                        "transformers",
                    )
                    p_.from.optional(transformers_dir).map(($) => {

                        if ($[0] !== 'directory') {
                            return abort(['not a directory', {
                                'internal path': "/typescript/lib/src/schemas/" + schema_id,
                                'name': "transformers",
                            }])
                        }

                        return p_.from.dictionary($[1]).map_and_aggregate_error<null, s_error.Error>(
                            ($, id, abort): null => {

                                if ($[0] !== 'file') {
                                    return abort(['not a file', {
                                        'internal path': "/typescript/lib/src/schemas/" + schema_id + "/transformers",
                                        'name': id,
                                    }])
                                }
                                p_.from.state($[1]).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'failure': return p_.option($, ($) => abort(['typescript parsing failed', {
                                                'location': {
                                                    'internal path': "/typescript/lib/src/schemas/" + schema_id + "/transformers",
                                                    'name': id,
                                                }
                                            }]))
                                            case 'success': return p_.option($, ($) => {

                                                p_.from.list($.statements).map_and_aggregate_error<string, s_error.Error>(
                                                    ($, abort): string => p_.from.state($).decide(
                                                        ($): string => {
                                                            switch ($[0]) {
                                                                case 'import': return p_.option($, ($) => "uitwerken")
                                                                case 'module': return p_.option($, ($) => "uitwerken")
                                                                case 'variable': return p_.option($, ($) => "uitwerken")
                                                                default: return abort(['unexpected construct', {
                                                                    'error': {
                                                                        'name': $[0],
                                                                        'location': t_cst_to_location.Statement($)
                                                                    },
                                                                    'file location': {
                                                                        'internal path': "/typescript/lib/src/schemas/" + schema_id + "/transformers",
                                                                        'name': id,
                                                                    },
                                                                }])
                                                            }
                                                        }
                                                    ),
                                                    ($) => abort(['aggregated', {
                                                        'errors': $
                                                    }])
                                                )
                                                return null
                                            })
                                            default: return p_.exhaustive($[0])
                                        }
                                    }
                                )

                                return null
                            },
                            ($) => abort(['aggregated', {
                                'errors': p_temp.from.dictionary($).convert_to_list(($, id) => $)
                            }])
                        )

                    })
                    const refiners_dir = p_.from.dictionary($[1]).get_possible_entry(
                        "refiners",
                    )
                    p_.from.optional(refiners_dir).map(($) => {

                        if ($[0] !== 'directory') {
                            return abort(['not a directory', {
                                'internal path': "/typescript/lib/src/schemas/" + schema_id,
                                'name': "refiners",
                            }])
                        }

                        return p_.from.dictionary($[1]).map_and_aggregate_error<null, s_error.Error>(
                            ($, id, abort): null => {

                                if ($[0] !== 'file') {
                                    return abort(['not a file', {
                                        'internal path': "/typescript/lib/src/schemas/" + schema_id + "/refiners",
                                        'name': id,
                                    }])
                                }
                                p_.from.state($[1]).decide(
                                    ($): null => {
                                        switch ($[0]) {
                                            case 'failure': return p_.option($, ($) => abort(['typescript parsing failed', {
                                                'location': {
                                                    'internal path': "/typescript/lib/src/schemas/" + schema_id + "/refiners",
                                                    'name': id,
                                                }
                                            }]))
                                            case 'success': return p_.option($, ($) => {

                                                p_.from.list($.statements).map_and_aggregate_error<any, s_error.Error>(
                                                    ($, abort) => p_.from.state($).decide(
                                                        ($) => {
                                                            switch ($[0]) {
                                                                case 'import': return p_.option($, ($) => "uitwerken")
                                                                case 'module': return p_.option($, ($) => "uitwerken")
                                                                case 'variable': return p_.option($, ($) => p_temp.from.list($['variable declaration list'].declarations).map_optionally(
                                                                    ($) => p_.from.state($).decide(
                                                                        ($): p_schema.Optional_Value<string> => {
                                                                            switch ($[0]) {
                                                                                case 'entry': return p_.option($, ($) => {
                                                                                    p_.from.optional($.assignment).map(
                                                                                        ($) => {
                                                                                            r_temp_typescript_from_cst.Expression(
                                                                                                $.initializer.expression,
                                                                                                ($) => abort(['unexpected construct', {
                                                                                                    'error': $,
                                                                                                    'file location': {
                                                                                                        'internal path': "/typescript/lib/src/schemas/" + schema_id + "/refiners",
                                                                                                        'name': id,
                                                                                                    }
                                                                                                }])
                                                                                            )
                                                                                            return null
                                                                                        }
                                                                                    )
                                                                                    return p_.literal.set("foo")
                                                                                })
                                                                                case 'separator': return p_.option($, ($) => p_.literal.not_set())
                                                                                default: return p_.exhaustive($[0])
                                                                            }
                                                                        }
                                                                    )
                                                                ))
                                                                default: return abort(['unexpected construct', {
                                                                    'error': {
                                                                        'name': $[0],
                                                                        'location': t_cst_to_location.Statement($)
                                                                    },
                                                                    'file location': {
                                                                        'internal path': "/typescript/lib/src/schemas/" + schema_id + "/transformers",
                                                                        'name': id,
                                                                    },
                                                                }])
                                                            }
                                                        }
                                                    ),
                                                    ($) => abort(['aggregated', {
                                                        'errors': $
                                                    }])
                                                )
                                                return null
                                            })
                                            default: return p_.exhaustive($[0])
                                        }
                                    }
                                )

                                return null
                            },
                            ($) => abort(['aggregated', {
                                'errors': p_temp.from.dictionary($).convert_to_list(($, id) => $)
                            }])
                        )

                    })
                    return {
                        'schema': schema_file[1]
                    }
                },
                ($) => abort(['aggregated', {
                    'errors': p_temp.from.dictionary($).convert_to_list(($, id) => $)
                }])
            )

        },
        () => {
            return p_.literal.dictionary({})
        }
    )


    const commands_dir = p_.from.dictionary(src_dir[1]).get_possible_entry(
        "commands",
    )
    const queries_dir = p_.from.dictionary(src_dir[1]).get_possible_entry(
        "queries",
    )
    const modules_dir = p_.from.dictionary(src_dir[1]).get_possible_entry(
        "modules",
    )
    const temp_dir = p_.from.dictionary(src_dir[1]).get_possible_entry(
        "temp",
    )

    return {
        'typescript': {
            'lib': {
                'src': {
                    'schemas': schemas
                }
            }
        }
    }
}