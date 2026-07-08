#!/usr/bin/env -S node --enable-source-maps

import * as p_h from 'pareto-host-nodejs/index'
import * as p_ci from 'pareto-core/interface/command_action'
import * as p_qi from 'pareto-core/interface/query_action'


//data types
import type * as d_ece from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import type * as d_espe from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_smelly_command_executable/data"
import type * as d_eqe from "pareto-resources/interface/generated/liana/schemas/execute_sandboxed_query_executable/data"

//resources
import * as rs_execute_unrestricted from "pareto-resource-execute-unrestricted/index"
import * as rs_stream from "pareto-resource-stream/index"
import * as rs_filesystem_unrestricted from "pareto-resource-filesystem-unrestricted/index"

//dependencies
//pareto-resources
import { $$ as q_execute_sandboxed_query_executable } from "pareto-resources/implementation/manual/queries/execute_sandboxed_query_executable"
import { $$ as c_execute_sandboxed_command_executable } from "pareto-resources/implementation/manual/commands/execute_sandboxed_command_executable"
import { $$ as c_execute_sandboxed_smelly_command_executable } from "pareto-resources/implementation/manual/commands/execute_sandboxed_smelly_command_executable"
//git module
import { $$ as q_git_is_repository_clean } from "lib/modules/git/implementation/manual/queries/repository_no_open_changes"
import { $$ as q_git_is_inside_work_tree } from "lib/modules/git/implementation/manual/queries/is_inside_work_tree"
import { $$ as c_git_assert_clean } from "lib/modules/git/implementation/manual/commands/assert_no_open_changes"
import { $$ as c_git_make_pristine } from "lib/modules/git/implementation/manual/commands/make_pristine"
import { $$ as c_git_extended_commit } from "lib/modules/git/implementation/manual/commands/extended_commit"
import { $$ as c_git_push } from "lib/modules/git/implementation/manual/commands/push"
//npm module
import { $$ as c_npm } from "lib/modules/npm/implementation/manual/commands/npm"
import { $$ as c_npm_publish } from "lib/modules/npm/implementation/manual/commands/publish"
import { $$ as c_set_up_comparison_against_published } from "lib/modules/npm/implementation/manual/commands/set_up_comparison_against_published"
import { $$ as c_npm_update_package_dependencies } from "lib/modules/npm/implementation/manual/commands/update_package_dependencies"
import { $$ as c_update2latest } from "lib/modules/npm/implementation/manual/commands/update2latest"
//internal
import { $$ as q_package_dependencies } from "lib/implementation/manual/queries/get_package_dependencies"
import { $$ as c_analyze_file_structure } from "lib/implementation/manual/commands/analyze_file_structure"
import { $$ as c_list_file_structure_problems } from "lib/implementation/manual/commands/list_file_structure_problems"
import { $$ as c_api } from "lib/implementation/manual/commands/execute_command"
import { $$ as c_main } from "lib/implementation/manual/commands/main"
import { $$ as c_build } from "lib/implementation/manual/commands/build"
import { $$ as c_build_and_test } from "lib/implementation/manual/commands/build_and_test"
import { $$ as c_dependency_graph } from "lib/implementation/manual/commands/create_dependency_graph"
import { $$ as c_git_commit } from "lib/implementation/manual/commands/version_control_commit"
import { $$ as c_publish } from "lib/implementation/manual/commands/publish"
import { $$ as c_tsc } from "lib/implementation/manual/commands/tsc"
import { $$ as c_update_package_dependencies } from "lib/implementation/manual/commands/update_package_dependencies"

p_h.run_main_command(
    () => {
        const create_eqe = (
            program: string,
        ): p_qi.Query_Action<d_eqe.Result, d_eqe.Error, d_eqe.Parameters> => q_execute_sandboxed_query_executable(
            {
                'program': program,
            },
            {
                'unrestricted': rs_execute_unrestricted.$.queries['query executable'],
            },
        )

        const create_ece = (
            program: string,
        ): p_ci.Command_Action<d_ece.Error, d_ece.Parameters> => c_execute_sandboxed_command_executable(
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
        ): p_ci.Command_Action<d_espe.Error, d_espe.Parameters> => c_execute_sandboxed_smelly_command_executable(
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
            null,
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
                'log': rs_stream.$.commands.log,
            },
        )


        const build_and_test = c_build_and_test(
            null,
            null,
            {
                'build': build,
                'node': ece_node,
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
            null,
            null,
            {
                'log error': rs_stream.$.commands['log error'],
                'api': c_api(
                    null,
                    {
                        'read directory': rs_filesystem_unrestricted.$.queries['read directory']
                    },
                    {
                        'version control assert no open changes': git.commands['assert no open changes'],
                        'build and test': build_and_test,
                        'build': build,
                        'create dependency graph': dependency_graph,
                        'analyze file structure': c_analyze_file_structure(
                            null,
                            {
                                'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                                'read file': rs_filesystem_unrestricted.$.queries['read file'],
                            },
                            {
                                'log': rs_stream.$.commands.log,
                            },
                        ),
                        'list file structure problems': c_list_file_structure_problems(
                            null,
                            {
                                'read directory': rs_filesystem_unrestricted.$.queries['read directory'],
                                'read file': rs_filesystem_unrestricted.$.queries['read file'],
                            },
                            {
                                'log': rs_stream.$.commands.log,
                            },
                        ),
                        'update package dependencies': update_package_dependencies,
                        'commit changes': c_git_commit(
                            null,
                            null,
                            {
                                'build and test': build_and_test,
                                'version control extended commit': git.commands['extended commit'],
                            },
                        ),
                        'npm set up comparison against published': set_up_comparison_against_published,
                        'publish': c_publish(
                            null,
                            {
                                'read file': rs_filesystem_unrestricted.$.queries['read file']
                            },
                            {
                                'build and test': build_and_test,
                                'version control push': git.commands['push'],
                                'version control assert no open changes': git.commands['assert no open changes'],
                                'version control make pristine': git.commands['make pristine'],
                                'npm': npm,
                                'npm publish': npm_publish,
                                'update package dependencies': update_package_dependencies,
                                'version control extended commit': git.commands['extended commit'],
                                'log': rs_stream.$.commands.log,
                            },
                        ),
                    },
                ),
            },
        )
    }
)
