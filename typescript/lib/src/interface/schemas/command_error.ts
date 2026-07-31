import * as p_ from 'pareto-core/interface/schema'


import type * as s_get_project_files from "../../submodules/file_structure_analysis/schemas/get_project_files.js"
import type * as s_get_package_files from "../../submodules/file_structure_analysis/schemas/get_package_files.js"
import type * as s_assert_clean from "../../submodules/version_control_api/schemas/assert_no_open_changes.js"
import type * as s_build from "./build.js"
import type * as s_build_and_validate from "./build_and_validate.js"
import type * as s_dependency_graph from "../../submodules/dependency_graph/schemas/create_dependency_graph.js"
import type * as s_git_commit from "./git_commit.js"
import type * as s_publish from "./publish.js"
import type * as s_read_directory from "./fs_unrestricted_read_directory.js"
import type * as s_set_up_comparison_against_published from "../../submodules/npm/schemas/set_up_comparison_against_published.js"
import type * as s_update_dependencies from "./update_package_dependencies.js"

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
    | ['get files', s_get_package_files.Error]
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
