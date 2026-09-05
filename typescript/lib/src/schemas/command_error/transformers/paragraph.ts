import * as p_ from 'pareto-core/transformer'

//schemas
import type * as s_in from "../schema.js"
import type * as s_out from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/schema"

namespace declarations {
    export type Error = p_.Transformer<
        s_in.Error,
        s_out.Phrase
    >
}

//shorthands
import * as sh from "pareto-fountain-pen/modules/paragraph/schemas/paragraph/shorthands/deprecated"

//dependencies
import * as t_git_commit_to_paragraph from "../../git_commit/transformers/paragraph.js"
import * as t_git_assert_no_open_changes_to_paragraph from "../../../modules/version_control_api/schemas/assert_no_open_changes/transformers/paragraph.js"

import * as t_build_and_validate_to_paragraph from "../../build_and_validate/transformers/paragraph.js"
import * as t_build_to_paragraph from "../../build/transformers/paragraph.js"
import * as t_dependency_graph_to_paragraph from "../../../modules/dependency_graph/schemas/create_dependency_graph/transformers/paragraph.js"
import * as t_get_project_files_to_paragraph from "../../../modules/file_structure_analysis/schemas/get_project_files/transformers/paragraph.js"
import * as t_list_package_file_structure_problems_to_paragraph from "../../../modules/file_structure_analysis/schemas/list_package_file_structure_problems/transformers/paragraph.js"
import * as t_publish from "../../publish/transformers/paragraph.js"
import * as t_update_dependencies from "../../update_package_dependencies/transformers/paragraph.js"
import * as ser_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_directory/serializers"
import * as t_set_up_comparison_against_published from "../../../modules/npm/schemas/set_up_comparison_against_published/transformers/paragraph.js"

export const Error: declarations.Error = ($) => p_.from.state($).decide(
    ($) => {
        switch ($[0]) {
            case 'package': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'build and validate': return p_.option($, ($) => t_build_and_validate_to_paragraph.Error(
                            $.error,
                            {
                                'concise': $.concise,
                                'context pathx': ""
                            }
                        ))
                        case 'list package file structure problems': return p_.option($, ($) => t_list_package_file_structure_problems_to_paragraph.Error($))
                        case 'publish': return p_.option($, ($) => t_publish.Error($, { 'context pathx': "" }))
                        case 'update dependencies': return p_.option($, ($) => t_update_dependencies.Error($))
                        case 'version control assert no open changes': return p_.option($, ($) => t_git_assert_no_open_changes_to_paragraph.Error($))
                        case 'commit changes': return p_.option($, ($) => t_git_commit_to_paragraph.Error($, { 'context pathx': "" }))

                        default: return p_.exhaustive($[0])
                    }
                }
            ))
            case 'all': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'packages': return p_.option($, ($) => sh.ph.composed([
                            sh.ph.text("could not execute command for the following packages:"),
                            sh.ph.indent(
                                sh.pg.sentences(
                                    p_.from.dictionary($).convert_to_list(
                                        ($, id) => sh.sentence([
                                            sh.ph.text("package '"),
                                            sh.ph.text(id),
                                            sh.ph.text("': "),
                                            p_.from.state($).decide(
                                                ($) => {
                                                    switch ($[0]) {
                                                        case 'build and validate': return p_.option($, ($) => t_build_and_validate_to_paragraph.Error(
                                                            $.error,
                                                            {
                                                                'concise': $.concise,
                                                                'context pathx': "/packages/" + id
                                                            }
                                                        ))
                                                        case 'build': return p_.option($, ($) => t_build_to_paragraph.Error(
                                                            $,
                                                            { 'concise': false }
                                                        ))
                                                        case 'version control assert no open changes': return p_.option($, ($) => t_git_assert_no_open_changes_to_paragraph.Error($))
                                                        case 'commit changes': return p_.option($, ($) => t_git_commit_to_paragraph.Error(
                                                            $,
                                                            {
                                                                'context pathx': "/packages/" + id
                                                            }
                                                        ))
                                                        case 'set up comparison': return p_.option($, ($) => t_set_up_comparison_against_published.Error($))
                                                        case 'update dependencies': return p_.option($, ($) => t_update_dependencies.Error($))
                                                        default: return p_.exhaustive($[0])
                                                    }
                                                })
                                        ])
                                    )
                                )
                            )
                        ]))
                        case 'could not read packages directory': return p_.option($, ($) => sh.ph.composed([
                            sh.ph.text("could not read packages directory: "),
                            sh.ph.text(ser_read_directory.Error($))
                        ]))
                        default: return p_.exhaustive($[0])
                    }
                }
            ))
            case 'project': return p_.option($, ($) => p_.from.state($).decide(
                ($) => {
                    switch ($[0]) {
                        case 'analyze file structure': return p_.option($, ($) => t_get_project_files_to_paragraph.Error($))
                        case 'dependency graph': return p_.option($, ($) => t_dependency_graph_to_paragraph.Error($))
                        default: return p_.exhaustive($[0])
                    }
                }
            ))
            case 'set up comparison': return p_.option($, ($) => t_set_up_comparison_against_published.Error($))
            default: return p_.exhaustive($[0])
        }
    })