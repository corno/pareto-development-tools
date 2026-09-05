import * as p_ from 'pareto-core/schema'


import type * as s_get_project_files from "../../modules/file_structure_analysis/schemas/get_project_files/schema.js"
import type * as s_list_package_file_structure_problems from "../../modules/file_structure_analysis/schemas/list_package_file_structure_problems/schema.js"
import type * as s_assert_clean from "../../modules/version_control_api/schemas/assert_no_open_changes/schema.js"
import type * as s_build from "../build/schema.js"
import type * as s_build_and_validate from "../build_and_validate/schema.js"
import type * as s_dependency_graph from "../../modules/dependency_graph/schemas/create_dependency_graph/schema.js"
import type * as s_git_commit from "../git_commit/schema.js"
import type * as s_publish from "../publish/schema.js"
import type * as s_read_directory from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/read_directory/schema"
import type * as s_set_up_comparison_against_published from "../../modules/npm/schemas/set_up_comparison_against_published/schema.js"
import type * as s_update_dependencies from "../update_package_dependencies/schema.js"

export type Error =
    | ['all', All_Error]
    | ['package', Package_Error]
    | ['project', Project_Error]

    | ['set up comparison', s_set_up_comparison_against_published.Error]

export type Project_Error =
    | ['analyze file structure', s_get_project_files.Error]

    | ['dependency graph', s_dependency_graph.Error]

export type Package_Error =
    | ['build and validate', {
        'error': s_build_and_validate.Error,
        'concise': boolean
    }]
    | ['list package file structure problems', s_list_package_file_structure_problems.Error]
    | ['version control assert no open changes', s_assert_clean.Error]
    | ['commit changes', s_git_commit.Error]
    | ['publish', s_publish.Error]
    | ['update dependencies', s_update_dependencies.Error]

export type All_Error =
    | ['could not read packages directory', s_read_directory.Error]
    | ['packages', p_.Dictionary<All__Package_Error>]

export type All__Package_Error =
    | ['build and validate', {
        'error': s_build_and_validate.Error,
        'concise': boolean
    }]
    | ['build', s_build.Error]
    | ['version control assert no open changes', s_assert_clean.Error]
    | ['commit changes', s_git_commit.Error]
    | ['update dependencies', s_update_dependencies.Error]
    | ['set up comparison', s_set_up_comparison_against_published.Error]
