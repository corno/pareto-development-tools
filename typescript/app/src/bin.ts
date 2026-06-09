#!/usr/bin/env -S node --enable-source-maps

import * as _pn from 'pareto-host-nodejs'
import * as _pi from 'pareto-core/dist/interface'
import * as _pq from 'pareto-core/dist/query'
import * as _pc from 'pareto-core/dist/command'
import __query from 'pareto-core/dist/__internals/async/query'

import * as d_epe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_command_executable/data"
import * as d_espe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_smelly_command_executable/data"
import * as d_eqe from "pareto-resources/dist/interface/generated/liana/schemas/execute_sandboxed_query_executable/data"

import { $$ as q_git_is_repository_clean } from "lib/dist/modules/git/implementation/manual/queries/is_repository_clean"
import { $$ as q_git_is_inside_work_tree } from "lib/dist/modules/git/implementation/manual/queries/is_inside_work_tree"
import { $$ as q_package_dependencies } from "lib/dist/implementation/manual/queries/get_package_dependencies"

import { $$ as q_execute_sandboxed_query_executable } from "pareto-resources/dist/implementation/manual/queries/execute_sandboxed_query_executable"

import { $$ as c_analyze_file_structure } from "lib/dist/implementation/manual/commands/analyze_file_structure"
import { $$ as c_list_file_structure_problems } from "lib/dist/implementation/manual/commands/list_file_structure_problems"
import { $$ as c_api } from "lib/dist/implementation/manual/commands/execute_command"
import { $$ as c_main } from "lib/dist/implementation/manual/commands/main"
import { $$ as c_build } from "lib/dist/implementation/manual/commands/build"
import { $$ as c_build_and_test } from "lib/dist/implementation/manual/commands/build_and_test"
import { $$ as c_dependency_graph } from "lib/dist/implementation/manual/commands/create_dependency_graph"
import { $$ as c_git_assert_clean } from "lib/dist/modules/git/implementation/manual/commands/assert_is_clean"
import { $$ as c_git_make_pristine } from "lib/dist/modules/git/implementation/manual/commands/make_pristine"
import { $$ as c_git_extended_commit } from "lib/dist/modules/git/implementation/manual/commands/extended_commit"
import { $$ as c_git_commit } from "lib/dist/implementation/manual/commands/git_commit"
import { $$ as c_git_push } from "lib/dist/modules/git/implementation/manual/commands/push"
import { $$ as c_git_remove_tracked_but_ignored } from "lib/dist/modules/git/implementation/manual/commands/remove_tracked_but_ignored"
import { $$ as c_npm } from "lib/dist/modules/npm/implementation/manual/commands/npm"
import { $$ as c_npm_publish } from "lib/dist/modules/npm/implementation/manual/commands/publish"
import { $$ as c_publish } from "lib/dist/implementation/manual/commands/publish"
import { $$ as c_set_up_comparison_against_published } from "lib/dist/modules/npm/implementation/manual/commands/set_up_comparison_against_published"
import { $$ as c_tsc } from "lib/dist/implementation/manual/commands/tsc"
import { $$ as c_update_package_dependencies } from "lib/dist/implementation/manual/commands/update_package_dependencies"
import { $$ as c_npm_update_package_dependencies } from "lib/dist/modules/npm/implementation/manual/commands/update_package_dependencies"
import { $$ as c_update2latest } from "lib/dist/modules/npm/implementation/manual/commands/update2latest"

import { $$ as c_execute_sandboxed_command_executable } from "pareto-resources/dist/implementation/manual/commands/execute_sandboxed_command_executable"
import { $$ as c_execute_sandboxed_smelly_command_executable } from "pareto-resources/dist/implementation/manual/commands/execute_sandboxed_smelly_command_executable"



_pn.run_main_command(
    ($r) => {
        const create_eqe = (
            program: string,
        ): _pi.Query<d_eqe.Result, d_eqe.Error, d_eqe.Parameters> => q_execute_sandboxed_query_executable(
            {
                'unrestricted': $r['execute unrestricted'].queries['query executable'],
            },
            {
                'program': program,
            }
        )

        const create_epe = (
            program: string,
        ): _pi.Command<d_epe.Error, d_epe.Parameters> => c_execute_sandboxed_command_executable(
            {
                'unrestricted': $r['execute unrestricted'].commands['command executable'],
            },
            null,
            {
                'program': program,
            }
        )

        const create_espe = (
            program: string,
        ): _pi.Command<d_espe.Error, d_espe.Parameters> => c_execute_sandboxed_smelly_command_executable(
            {
                'unrestricted': $r['execute unrestricted'].commands['smelly command executable'],
            },
            null,
            {
                'program': program,
            }
        )

        const eqe_git = create_eqe("git")
        const eqe_npm = create_eqe("npm")

        const epe_git = create_epe("git")
        const epe_npm = create_epe("npm")
        const epe_tsc = create_espe("tsc")
        const epe_node = create_epe("node")
        const epe_update2latest = create_epe("update2latest")
        const epe_tar = create_epe("tar")

        const git_is_repository_clean = q_git_is_repository_clean(
            {
                'git': eqe_git,
                'is inside git work tree': q_git_is_inside_work_tree(
                    {
                        'git': eqe_git,
                    },
                    null,
                ),
            },
            null,
        )

        const git_assert_is_clean = c_git_assert_clean(
            {
                'git': epe_git,
            },
            {
                'is repository clean': git_is_repository_clean,
            },
            null,
        )

        const tsc = c_tsc(
            {
                'tsc': epe_tsc,
            },
            null,
            null,
        )

        const build = c_build(
            {
                'tsc': tsc,
                'remove': $r['filesystem unrestricted'].commands.remove,
                'chmod': $r['filesystem unrestricted'].commands.chmod,
            },
            {
                'stat': $r['filesystem unrestricted'].queries['stat possible node']
            },
            null,
        )

        const dependency_graph = c_dependency_graph(
            {
                'log': $r.stream.commands.log,
            },
            {
                'package dependencies': q_package_dependencies(
                    {
                        'read directory': $r['filesystem unrestricted'].queries['read directory'],
                        'read file': $r['filesystem unrestricted'].queries['read file'],
                    },
                    null,
                ),
            },
            null,
        )

        const git_make_pristine = c_git_make_pristine(
            {
                'git': epe_git,
            },
            null,
            null,
        )

        const build_and_test = c_build_and_test(
            {
                'build': build,
                'node': epe_node,
            },
            null,
            null,
        )

        const update2latest = c_update2latest(
            {
                'update2latest': epe_update2latest,
            },
            null,
            null,
        )

        const npm = c_npm(
            {
                'npm': epe_npm,
            },
            null,
            null,
        )

        const npm_publish = c_npm_publish(
            {
                'npm': epe_npm,
            },
            null,
            null,
        )

        const npm_update_package_dependencies = c_npm_update_package_dependencies(
            {
                'remove': $r['filesystem unrestricted'].commands.remove,
                'update2latest': update2latest,
                'npm': npm,
            },
            null,
            null,
        )

        const update_package_dependencies = c_update_package_dependencies(
            {
                'npm update package dependencies': npm_update_package_dependencies,
            },
            {
                'stat': $r['filesystem unrestricted'].queries['stat possible node'],
            },
            null,
        )

        const git_push = c_git_push(
            {
                'git': epe_git,
            },
            null,
            null,
        )

        const git_remove_tracked_but_ignored = c_git_remove_tracked_but_ignored(
            {
                'git': epe_git,
                'assert is clean': git_assert_is_clean,
            },
            {
                'git': eqe_git,
            },
            null,
        )

        const git_extended_commit = c_git_extended_commit(
            {
                'git': epe_git,
            },
            {
                'git is repository clean': git_is_repository_clean,
            },
            null,
        )

        const set_up_comparison_against_published = c_set_up_comparison_against_published(
            {
                'npm': epe_npm,
                'tar': epe_tar,
                'make directory': $r['filesystem unrestricted'].commands['make directory'],
                // 'remove': $r.commands.remove,
            },
            {
                'read file': $r['filesystem unrestricted'].queries['read file'],
                'npm': eqe_npm,
            },
            null,
        )

        return c_main(
            {
                'log error': $r.stream.commands['log error'],
                'api': c_api(
                    {
                        'git assert is clean': git_assert_is_clean,
                        'build and test': build_and_test,
                        'build': build,
                        'create dependency graph': dependency_graph,
                        'analyze file structure': c_analyze_file_structure(
                            {
                                'log': $r.stream.commands.log,
                            },
                            {
                                'read directory': $r['filesystem unrestricted'].queries['read directory'],
                                'read file': $r['filesystem unrestricted'].queries['read file'],
                            },
                            null,
                        ),
                        'list file structure problems': c_list_file_structure_problems(
                            {
                                'log': $r.stream.commands.log,
                            },
                            {
                                'read directory': $r['filesystem unrestricted'].queries['read directory'],
                                'read file': $r['filesystem unrestricted'].queries['read file'],
                            },
                            null,
                        ),
                        'git remove tracked but ignored': git_remove_tracked_but_ignored,
                        'update package dependencies': update_package_dependencies,
                        'git commit': c_git_commit(
                            {
                                'build and test': build_and_test,
                                'git extended commit': git_extended_commit,
                            },
                            null,
                            null,
                        ),
                        'npm set up comparison against published': set_up_comparison_against_published,
                        'publish': c_publish(
                            {
                                'build and test': build_and_test,
                                'git push': git_push,
                                'git assert is clean': git_assert_is_clean,
                                'git make pristine': git_make_pristine,
                                'npm': npm,
                                'npm publish': npm_publish,
                                'update package dependencies': update_package_dependencies,
                                'git extended commit': git_extended_commit,
                                'log': $r.stream.commands.log,
                            },
                            {
                                'read file': $r['filesystem unrestricted'].queries['read file']
                            },
                            null,
                        ),
                    },
                    {
                        'read directory': $r['filesystem unrestricted'].queries['read directory']
                    },
                    null,
                ),
            },
            null,
            null,
        )
    }
)
