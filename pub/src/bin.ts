#!/usr/bin/env -S node --enable-source-maps

import * as _pn from 'pareto-host-nodejs'
import * as _pi from 'pareto-core/dist/interface'
import * as _pq from 'pareto-core/dist/query'
import * as _pc from 'pareto-core/dist/command'

import * as d_epe from "pareto-resources/dist/interface/generated/liana/schemas/execute_command_executable/data"
import * as d_espe from "pareto-resources/dist/interface/generated/liana/schemas/execute_smelly_command_executable/data"
import * as d_eqe from "pareto-resources/dist/interface/generated/liana/schemas/execute_query_executable/data"

import { $$ as q_git_is_repository_clean } from "./modules/git/implementation/manual/queries/is_repository_clean"
import { $$ as q_git_is_inside_work_tree } from "./modules/git/implementation/manual/queries/is_inside_work_tree"
import { $$ as q_package_dependencies } from "./implementation/manual/queries/get_package_dependencies"

import { $$ as c_analyze_file_structure } from "./implementation/manual/commands/analyze_file_structure"
import { $$ as c_list_file_structure_problems } from "./implementation/manual/commands/list_file_structure_problems"
import { $$ as c_api } from "./implementation/manual/commands/execute_command"
import { $$ as c_main } from "./implementation/manual/commands/main"
import { $$ as c_build } from "./implementation/manual/commands/build"
import { $$ as c_build_and_test } from "./implementation/manual/commands/build_and_test"
import { $$ as c_dependency_graph } from "./implementation/manual/commands/create_dependency_graph"
import { $$ as c_fp_log } from "./modules/pareto-fountain-pen-directory/implementation/manual/commands/console_log"
import { $$ as c_git_assert_clean } from "./modules/git/implementation/manual/commands/assert_is_clean"
import { $$ as c_git_make_pristine } from "./modules/git/implementation/manual/commands/make_pristine"
import { $$ as c_git_extended_commit } from "./modules/git/implementation/manual/commands/extended_commit"
import { $$ as c_git_commit } from "./implementation/manual/commands/git_commit"
import { $$ as c_git_push } from "./modules/git/implementation/manual/commands/push"
import { $$ as c_git_remove_tracked_but_ignored } from "./modules/git/implementation/manual/commands/remove_tracked_but_ignored"
import { $$ as c_npm } from "./modules/npm/implementation/manual/commands/npm"
import { $$ as c_npm_publish } from "./modules/npm/implementation/manual/commands/npm_publish"
import { $$ as c_publish } from "./implementation/manual/commands/publish"
import { $$ as c_set_up_comparison_against_published } from "./modules/npm/implementation/manual/commands/set_up_comparison_against_published"
import { $$ as c_tsc } from "./implementation/manual/commands/tsc"
import { $$ as c_update_package_dependencies } from "./implementation/manual/commands/update_package_dependencies"
import { $$ as c_npm_update_package_dependencies } from "./modules/npm/implementation/manual/commands/update_package_dependencies"
import { $$ as c_update2latest } from "./modules/npm/implementation/manual/commands/update2latest"

const create_eqe = (
    program: string,
    $r: _pn.Available_Standard_Resources,
): _pi.Query<d_eqe.Result, d_eqe.Error, d_eqe.Parameters> => _pq.__query(
    ($p) => {
        return $r.queries['execute any query executable'](
            {
                'program': program,
                'args': $p.args,
            },
            ($) => $,
        )
    }
)

const create_epe = (
    program: string,
    $r: _pn.Available_Standard_Resources,
): _pi.Command<d_epe.Error, d_epe.Parameters> => _pc.__command(
    ($p) => $r.commands['execute any command executable'].execute(
        {
            'program': program,
            'args': $p.args,
        },
        ($) => $,
    )
)

const create_espe = (
    program: string,
    $r: _pn.Available_Standard_Resources,
): _pi.Command<d_espe.Error, d_espe.Parameters> => _pc.__command(($p) => $r.commands['execute any smelly command executable'].execute(
    {
        'program': program,
        'args': $p.args,
    },
    ($) => $,
))

_pn.run_main_command(
    ($r) => {

        const git_is_repository_clean = q_git_is_repository_clean({
            'git': create_eqe(`git`, $r),
            'is inside git work tree': q_git_is_inside_work_tree({
                'git': create_eqe(`git`, $r),
            }),
        })

        const git_assert_is_clean = c_git_assert_clean(
            {
                'git': create_epe(`git`, $r),
            },
            {
                'is repository clean': git_is_repository_clean,
            },
        )

        const tsc = c_tsc(
            {
                'tsc': create_espe(`tsc`, $r),
            },
            null,
        )

        const build = c_build(
            {
                'tsc': tsc,
                'remove': $r.commands.remove
            },
            null,
        )

        const dependency_graph = c_dependency_graph(
            {
                'log': c_fp_log(
                    {
                        'log': $r.commands.log,
                    },
                    null,
                ),
            },
            {
                'package dependencies': q_package_dependencies(
                    {
                        'read directory': $r.queries['read directory'],
                        'read file': $r.queries['read file'],
                    },
                ),
            },
        )

        const git_make_pristine = c_git_make_pristine(
            {
                'git': create_epe(`git`, $r),
            },
            null,
        )

        const build_and_test = c_build_and_test(
            {
                'build': build,
                'node': create_epe(`node`, $r),
            },
            null,
        )

        const update2latest = c_update2latest(
            {
                'update2latest': create_epe(`update2latest`, $r),
            },
            null,
        )

        const npm = c_npm(
            {
                'npm': create_epe(`npm`, $r),
            },
            null,
        )

        const npm_publish = c_npm_publish(
            {
                'npm': create_epe(`npm`, $r),
            },
            null,
        )

        const npm_update_package_dependencies = c_npm_update_package_dependencies(
            {
                'remove': $r.commands.remove,
                'update2latest': update2latest,
                'npm': npm,
            },
            null,
        )

        const update_package_dependencies = c_update_package_dependencies(
            {
                'npm update package dependencies': npm_update_package_dependencies,
            },
            null,
        )

        const git_push = c_git_push(
            {
                'git': create_epe(`git`, $r),
            },
            null,
        )

        const git_remove_tracked_but_ignored = c_git_remove_tracked_but_ignored(
            {
                'git': create_epe(`git`, $r),
                'assert is clean': git_assert_is_clean,
            },
            {
                'git': create_eqe(`git`, $r),
            },
        )

        const git_extended_commit = c_git_extended_commit(
            {
                'git': create_epe(`git`, $r),
            },
            {
                'git is repository clean': git_is_repository_clean,
            },
        )

        const set_up_comparison_against_published = c_set_up_comparison_against_published(
            {
                'npm': create_epe(`npm`, $r),
                'tar': create_epe(`tar`, $r),
                'make directory': $r.commands['make directory'],
                'remove': $r.commands.remove,
            },
            {
                'read file': $r.queries['read file'],
                'npm': create_eqe(`npm`, $r),
            },
        )

        return c_main(
            {
                'log error': $r.commands['log error'],
                'api': c_api(
                    {
                        'git assert is clean': git_assert_is_clean,
                        'build and test': build_and_test,
                        'build': build,
                        'create dependency graph': dependency_graph,
                        'analyze file structure': c_analyze_file_structure(
                            {
                                'log': $r.commands.log,
                            },
                            {
                                'read directory': $r.queries['read directory'],
                                'read file': $r.queries['read file'],
                            },
                        ),
                        'list file structure problems': c_list_file_structure_problems(
                            {
                                'log': $r.commands.log,
                            },
                            {
                                'read directory': $r.queries['read directory'],
                                'read file': $r.queries['read file'],
                            },
                        ),
                        'git remove tracked but ignored': git_remove_tracked_but_ignored,
                        'update package dependencies': update_package_dependencies,
                        'git commit': c_git_commit(
                            {
                                'build and test': build_and_test,
                                'git extended commit': git_extended_commit,
                            },
                            null
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
                                'log': $r.commands.log,
                            },
                            {
                                'read file': $r.queries['read file']
                            },
                        ),
                    },
                    {
                        'read directory': $r.queries['read directory']
                    },
                ),
            },
            null,
        )
    }
)
