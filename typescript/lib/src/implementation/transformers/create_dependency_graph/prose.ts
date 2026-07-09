import * as p_ from 'pareto-core/implementation/transformer'

import type * as interface_ from "../../../declarations/transformers/create_dependency_graph/prose.js"

//shorthands
import * as sh from "pareto-fountain-pen/shorthands/prose/deprecated"

//dependencies
import * as t_get_package_dependencies_to_prose from "../get_package_dependencies/prose.js"

export const Error: interface_.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'log': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("log: "),
                sh.ph.indent(
                    sh.pg.sentences([
                        // t_tsc_to_prose.Error($)
                    ]))
            ]))
            case 'package dependencies': return p_.option($, ($) => sh.ph.composed([
                sh.ph.literal("package dependencies: "),
                sh.ph.indent(
                    sh.pg.sentences([
                        sh.sentence([
                            t_get_package_dependencies_to_prose.Error($)
                        ])
                    ])
                )
            ]))
            default: return p_.exhaustive($[0])
        }
    })