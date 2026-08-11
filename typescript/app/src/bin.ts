#!/usr/bin/env -S node --enable-source-maps

import * as p_h from 'pareto-core-application/index'
import * as p_ci from 'pareto-core/interface/command_interface'
import * as p_qi from 'pareto-core/interface/query_interface'


//schemas
import type * as s_ece from "pareto-execute-sandboxed/schemas/execute_sandboxed_command_executable/schema"
import type * as s_espe from "pareto-execute-sandboxed/schemas/execute_sandboxed_smelly_command_executable/schema"
import type * as s_eqe from "pareto-execute-sandboxed/schemas/execute_sandboxed_query_executable/schema"

//resources
import * as rs_execute_unrestricted from "pareto-resource-execute-unrestricted/index"
import * as rs_stream from "pareto-resource-stream/index"
import * as rs_filesystem_unrestricted from "pareto-resource-filesystem-unrestricted/index"

//dependencies
//pareto-resources
import { $$ as q_execute_sandboxed_query_executable } from "pareto-execute-sandboxed/queries/implementations/execute_sandboxed_query_executable"
import { $$ as c_execute_sandboxed_command_executable } from "pareto-execute-sandboxed/commands/implementations/execute_sandboxed_command_executable"
import { $$ as c_execute_sandboxed_smelly_command_executable } from "pareto-execute-sandboxed/commands/implementations/execute_sandboxed_smelly_command_executable"
//git module
import { $$ as q_git_is_repository_clean } from "lib/modules/git/queries/implementations/repository_no_open_changes"
import { $$ as q_git_is_inside_work_tree } from "lib/modules/git/queries/implementations/is_inside_work_tree"
import { $$ as c_git_assert_clean } from "lib/modules/git/commands/implementations/assert_no_open_changes"
import { $$ as c_git_make_pristine } from "lib/modules/git/commands/implementations/make_pristine"
import { $$ as c_git_extended_commit } from "lib/modules/git/commands/implementations/extended_commit"
import { $$ as c_git_push } from "lib/modules/git/commands/implementations/push"
//npm module
import { $$ as c_npm } from "lib/modules/npm/commands/implementations/npm"
import { $$ as c_npm_publish } from "lib/modules/npm/commands/implementations/publish"
import { $$ as c_set_up_comparison_against_published } from "lib/modules/npm/commands/implementations/set_up_comparison_against_published"
import { $$ as c_npm_update_package_dependencies } from "lib/modules/npm/commands/implementations/update_package_dependencies"
import { $$ as c_update2latest } from "lib/modules/npm/commands/implementations/update2latest"

//file structure analysis module
import { $$ as c_analyze_file_structure } from "lib/modules/file_structure_analysis/commands/implementations/analyze_project_file_structure"
import { $$ as c_list_package_file_structure_problems } from "lib/modules/file_structure_analysis/commands/implementations/list_package_file_structure_problems"
import { $$ as c_validate_file_structure } from "lib/modules/file_structure_analysis/commands/implementations/validate_file_structure"

//internal
import { $$ as q_package_dependencies } from "lib/modules/dependency_graph/queries/implementations/get_package_dependencies"
import { $$ as c_api } from "lib/commands/implementations/execute_command"
import { $$ as c_main } from "lib/commands/implementations/main"
import { $$ as c_build } from "lib/commands/implementations/build"
import { $$ as c_build_and_validate } from "lib/commands/implementations/build_and_validate"
import { $$ as c_dependency_graph } from "lib/modules/dependency_graph/commands/implementations/create_dependency_graph"
import { $$ as c_git_commit } from "lib/commands/implementations/version_control_commit"
import { $$ as c_publish } from "lib/commands/implementations/publish"
import { $$ as c_tsc } from "lib/commands/implementations/tsc"
import { $$ as c_update_package_dependencies } from "lib/commands/implementations/update_package_dependencies"

//data
import * as data_structure from "./data/structure.js"

p_h.run_main_command(
    () => {
        const create_eqe = (
            program: string,
        ): p_qi.Query_Interface<s_eqe.Result, s_eqe.Error, s_eqe.Parameters> => q_execute_sandboxed_query_executable(
            {
                'program': program,
            },
            {
                'unrestricted': rs_execute_unrestricted.$.queries['query executable'],
            },
        )

        const create_ece = (
            program: string,
        ): p_ci.Command_Interface<s_ece.Error, s_ece.Parameters> => c_execute_sandboxed_command_executable(
            {
                'program': program,
            },
            null,
            {
                'unrestricted': rs_execute_unrestricted.$.commands['command executable'],
            },
        )

        const create_espe = (
            program: string,
        ): p_ci.Command_Interface<s_espe.Error, s_espe.Parameters> => c_execute_sandboxed_smelly_command_executable(
            {
                'program': program,
            },
            null,
            {
                'unrestricted': rs_execute_unrestricted.$.commands['smelly command executable'],
            },
        )

        const eqe_git = create_eqe("git")
        const eqe_npm = create_eqe("npm")

        const ece_git = create_ece("git")
        const ece_npm = create_ece("npm")
        const ece_tsc = create_espe("tsc")
        const ece_node = create_ece("node")
        const ece_update2latest = create_ece("update2latest")
        const ece_tar = create_ece("tar")

        const git = (() => {

            const git_is_repository_clean = q_git_is_repository_clean(
                null,
                {
                    'git': eqe_git,
                    'is inside work tree': q_git_is_inside_work_tree(
                        null,
                        {
                            'git': eqe_git,
                        },
                    ),
                },
            )

            const git_assert_is_clean = c_git_assert_clean(
                null,
                {
                    'repository no open changes': git_is_repository_clean,
                },
                {
                    'git': ece_git,
                },
            )


            const git_make_pristine = c_git_make_pristine(
                null,
                null,
                {
                    'git': ece_git,
                },
            )
            const git_push = c_git_push(
                null,
                null,
                {
                    'git': ece_git,
                },
            )

            const git_extended_commit = c_git_extended_commit(
                null,
                {
                    'repository no open changes': git_is_repository_clean,
                },
                {
                    'git': ece_git,
                },
            )

            return {
                'queries': {
                    'repository no open changes': git_is_repository_clean,
                },
                'commands': {
                    'assert no open changes': git_assert_is_clean,
                    'make pristine': git_make_pristine,
                    'push': git_push,
                    'extended commit': git_extended_commit,
                },
            }
        })()



        const tsc = c_tsc(
            null,
            null,
            {
                'tsc': ece_tsc,
            },
        )

        const build = c_build(
            null,
            {
                'stat': rs_filesystem_unrestricted.$.queries['stat possible node']
            },
            {
                'tsc': tsc,
                'remove': rs_filesystem_unrestricted.$.commands.remove,
                'chmod': rs_filesystem_unrestricted.$.commands.chmod,
            },
        )

        const dependency_graph = c_dependency_graph(
            {
                'indentation': "    ",
            },
            {
                'package dependencies': q_package_dependencies(
                    null,
                    {
                        'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                        'read file': rs_filesystem_unrestricted.$.queries['read file'],
                    },
                ),
            },
            {
                'log lines': rs_stream.$.commands['log lines'],
            },
        )


        const build_and_validate = c_build_and_validate(
            null,
            null,
            {
                'build': build,
                'node': ece_node,
                'validate file structure': c_validate_file_structure(
                    {
                        'structure': data_structure.$$,
                        'indentation': "    ",
                    },
                    {
                        'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                        'read file': rs_filesystem_unrestricted.$.queries['read file'],
                    },
                    {
                        'log lines': rs_stream.$.commands['log lines'],
                    },
                ),
            },
        )

        const update2latest = c_update2latest(
            null,
            null,
            {
                'update2latest': ece_update2latest,
            },
        )

        const npm = c_npm(
            null,
            null,
            {
                'npm': ece_npm,
            },
        )

        const npm_publish = c_npm_publish(
            null,
            null,
            {
                'npm': ece_npm,
            },
        )

        const npm_update_package_dependencies = c_npm_update_package_dependencies(
            null,
            null,
            {
                'remove': rs_filesystem_unrestricted.$.commands.remove,
                'update2latest': update2latest,
                'npm': npm,
            },
        )

        const update_package_dependencies = c_update_package_dependencies(
            null,
            {
                'stat': rs_filesystem_unrestricted.$.queries['stat possible node'],
            },
            {
                'npm update package dependencies': npm_update_package_dependencies,
            },
        )

        const set_up_comparison_against_published = c_set_up_comparison_against_published(
            null,
            {
                'read file': rs_filesystem_unrestricted.$.queries['read file'],
                'npm': eqe_npm,
            },
            {
                'npm': ece_npm,
                'tar': ece_tar,
                'make directory': rs_filesystem_unrestricted.$.commands['make directory'],
                // 'remove': rs_filesystem_unrestricted.$.commands.remove,
            },
        )

        return c_main(
            {
                'indentation': "    ",
            },
            null,
            {
                'log error lines': rs_stream.$.commands['log error lines'],
                'api': c_api(
                    null,
                    {
                        'read directory': rs_filesystem_unrestricted.$.queries['read directory']
                    },
                    {
                        'version control assert no open changes': git.commands['assert no open changes'],
                        'build and validate': build_and_validate,
                        'build': build,
                        'create dependency graph': dependency_graph,
                        'analyze project file structure': c_analyze_file_structure(
                            {
                                'structure': data_structure.$$,
                                'indentation': "    ",
                            },
                            {
                                'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                                'read file': rs_filesystem_unrestricted.$.queries['read file'],
                            },
                            {
                                'log lines': rs_stream.$.commands['log lines'],
                            },
                        ),
                        'list package file structure problems': c_list_package_file_structure_problems(
                            {
                                'structure': data_structure.$$,
                                'indentation': "    ",
                            },
                            {
                                'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                                'read file': rs_filesystem_unrestricted.$.queries['read file'],
                            },
                            {
                                'log lines': rs_stream.$.commands['log lines'],
                            },
                        ),
                        'update package dependencies': update_package_dependencies,
                        'commit changes': c_git_commit(
                            null,
                            null,
                            {
                                'build and validate': build_and_validate,
                                'version control extended commit': git.commands['extended commit'],
                            },
                        ),
                        'npm set up comparison against published': set_up_comparison_against_published,
                        'publish': c_publish(
                            {
                                'indentation': "    ",
                            },
                            {
                                'read file': rs_filesystem_unrestricted.$.queries['read file']
                            },
                            {
                                'build and validate': build_and_validate,
                                'version control push': git.commands['push'],
                                'version control assert no open changes': git.commands['assert no open changes'],
                                'version control make pristine': git.commands['make pristine'],
                                'npm': npm,
                                'npm publish': npm_publish,
                                'update package dependencies': update_package_dependencies,
                                'version control extended commit': git.commands['extended commit'],
                                'log lines': rs_stream.$.commands['log lines'],
                            },
                        ),
                    },
                ),
            },
        )
    }
)
