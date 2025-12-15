#!/usr/bin/env -S node --enable-source-maps

import * as _eb from 'exupery-core-bin'
import * as _easync from 'exupery-core-async'
import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { $$ as q_is_git_clean } from "./modules/git/implementation/queries/repository_is_clean"
import { $$ as q_git_is_inside_work_tree } from "./modules/git/implementation/queries/is_inside_work_tree"

import { $$ as p_bin } from "./implementation/commands/bin"
import { $$ as p_api } from "./implementation/commands/api"
import { $$ as p_git_assert_clean } from "./modules/git/implementation/commands/assert-clean"
import { $$ as p_build_and_test } from "./implementation/commands/build_and_test"
import { $$ as p_build } from "./implementation/commands/build"
import { $$ as p_git_remove_tracked_but_ignored } from "./modules/git/implementation/commands/remove-tracked-but-ignored"
import { $$ as p_update_dependencies } from "./implementation/commands/update-dependencies"
import { $$ as p_git_extended_commit } from "./modules/git/implementation/commands/extended_commit"
import { $$ as p_tsc } from "./implementation/commands/tsc"
import { $$ as p_update_typescript_dependencies } from "./implementation/commands/clean_and_update_dependencies"
import { $$ as p_git_clean } from "./modules/git/implementation/commands/clean"
import { $$ as p_update2latest } from "./modules/npm/implementation/commands/update2latest"
import { $$ as p_npm } from "./modules/npm/implementation/commands/npm"
import { $$ as p_set_up_comparison_against_published } from "./modules/npm/implementation/commands/set_up_comparison_against_published"

const create_eqe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Query<d_eqe.Result, d_epe.Error, d_epe.Parameters> => {
    return _easync.__create_query(
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
}

const create_epe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Command<d_epe.Error, d_epe.Parameters> => {
    return _easync.__create_resource_command(($p) => {
        return $r.commands['execute any procedure executable'].execute(
            {
                'program': program,
                'args': $p.args,
            },
            ($) => $,
        )
    })
}

const create_espe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Command<d_espe.Error, d_espe.Parameters> => {
    return _easync.__create_resource_command(($p) => {
        return $r.commands['execute any smelly procedure executable'].execute(
            {
                'program': program,
                'args': $p.args,
            },
            ($) => $,
        )
    })
}

_eb.run_main_procedure(
    ($r) => {

        const is_git_clean = q_is_git_clean({
            'git': create_eqe(`git`, $r),
            'is inside git work tree': q_git_is_inside_work_tree({
                'git': create_eqe(`git`, $r),
            }),
        })

        const assert_git_is_clean = p_git_assert_clean(
            {
                'git': create_epe(`git`, $r),
            },
            {
                'is git clean': is_git_clean,
            },
        )

        const tsc = p_tsc(
            {
                'tsc': create_espe(`tsc`, $r),
            },
            null,
        )

        const build = p_build(
            {
                'tsc': tsc,
                'remove': $r.commands.remove
            },
            null,
        )

        const git_clean = p_git_clean(
            {
                'git': create_epe(`git`, $r),
            },
            null,
        )

        const build_and_test = p_build_and_test(
            {
                'build': build,
                'node': create_epe(`node`, $r),
            },
            null,
        )

        const update2latest = p_update2latest(
            {
                'update2latest': create_epe(`update2latest`, $r),
            },
            null,
        )

        const npm = p_npm(
            {
                'npm': create_epe(`npm`, $r),
            },
            null,
        )

        const update_typescript_dependencies = p_update_typescript_dependencies(
            {
                'git clean': git_clean,
                'update2latest': update2latest,
                'npm': npm,
            },
            null,
        )

        const clean_and_update_dependencies = p_update_dependencies(
            {
                'clean and update dependencies': update_typescript_dependencies,
            },
            null,
        )

        const git_remove_tracked_but_ignored = p_git_remove_tracked_but_ignored(
            {
                'git': create_epe(`git`, $r),
                'assert git is clean': assert_git_is_clean,
            },
            {
                'git': create_eqe(`git`, $r),
            },
        )

        const git_extended_commit = p_git_extended_commit(
            {
                'git': create_epe(`git`, $r),
            },
            {
                'git is clean': is_git_clean,
            },
        )

        const set_up_comparison_against_published = p_set_up_comparison_against_published(
            {
                'npm': create_epe(`npm`, $r),
                'tar': create_epe(`tar`, $r),
                'make directory': $r.commands['make directory'],
            },
            {
                'read file': $r.queries['read file'],
                'npm': create_eqe(`npm`, $r),
            },
        )

        return p_bin(
            {
                'api': p_api(
                    {
                        'git assert clean': assert_git_is_clean,
                        'build and test': build_and_test,
                        'build': build,
                        'git remove tracked but ignored': git_remove_tracked_but_ignored,
                        'update dependencies': clean_and_update_dependencies,
                        'git extended commit': git_extended_commit,
                        'set up comparison against published': set_up_comparison_against_published,
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
