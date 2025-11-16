#!/usr/bin/env -S node --enable-source-maps

import * as _eb from 'exupery-core-bin'
import * as _easync from 'exupery-core-async'
import * as _et from 'exupery-core-types'

import * as d_main from "exupery-resources/dist/interface/temp_main"
import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"
import * as d_eqe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_query_executable/data_types/source"

import { $$ as q_is_git_clean } from "./implementation/algorithms/queries/git_is_clean"
import { $$ as q_git_is_inside_work_tree } from "./implementation/algorithms/queries/git_is_inside_work_tree"

import { $$ as p_bin } from "./implementation/algorithms/procedures/bin"
import { $$ as p_api } from "./implementation/algorithms/procedures/api"
import { $$ as p_git_assert_clean } from "./implementation/algorithms/procedures/api/git-assert-clean"
import { $$ as p_build_and_test } from "./implementation/algorithms/procedures/api/build_and_test"
import { $$ as p_build } from "./implementation/algorithms/procedures/api/build"
import { $$ as p_git_remove_tracked_but_ignored } from "./implementation/algorithms/procedures/api/git-remove-tracked-but-ignored"
import { $$ as p_update_dependencies } from "./implementation/algorithms/procedures/api/update-dependencies"
import { $$ as p_git_extended_commit } from "./implementation/algorithms/procedures/api/git_extended_commit"
import { $$ as p_tsc } from "./implementation/algorithms/procedures/api/tsc"
import { $$ as p_update_typescript_dependencies } from "./implementation/algorithms/procedures/api/update-typescript-dependencies"
import { $$ as p_git_clean } from "./implementation/algorithms/procedures/api/git-clean"
import { $$ as p_update2latest } from "./implementation/algorithms/procedures/api/update2latest"
import { $$ as p_npm } from "./implementation/algorithms/procedures/api/npm"

const create_eqe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Data_Preparer<d_epe.Parameters, d_eqe.Result, d_epe.Error> => {
    return _easync.__create_query(($p) => {
        return $r.queries['execute any query executable'](
            {
                'program': program,
                'args': $p.args,
            },
        )
    })
}

const create_epe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Command<d_epe.Parameters, d_epe.Error> => {
    return _easync.__create_command(($p) => {
        return $r.commands['execute any procedure executable'].execute.direct(
            ($) => $,
            {
                'program': program,
                'args': $p.args,
            },
        )
    })
}

const create_espe = (
    program: string,
    $r: _eb.Available_Standard_Resources,
): _et.Command<d_espe.Parameters, d_espe.Error> => {
    return _easync.__create_command(($p) => {
        return $r.commands['execute any smelly procedure executable'].execute.direct(
            ($) => $,
            {
                'program': program,
                'args': $p.args,
            },
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

        const assert_git_is_clean = p_git_assert_clean({
            'queries': {
                'is git clean': is_git_clean,
            },
            'commands': {
                'git': create_epe(`git`, $r),
            },
        })

        const tsc = p_tsc({
            'commands': {
                'tsc': create_espe(`tsc`, $r),
            }
        })

        const build = p_build({
            'commands': {
                'tsc': tsc,
            },
        })

        const git_clean = p_git_clean({
            'commands': {
                'git': create_epe(`git`, $r),
            }
        })

        const build_and_test = p_build_and_test({
            'commands': {
                'build': build,
                'node': create_epe(`node`, $r),
            },
        })

        const update2latest = p_update2latest({
            'commands': {
                'update2latest': create_epe(`update2latest`, $r),
            },
        })

        const npm = p_npm({
            'commands': {
                'npm': create_epe(`npm`, $r),
            },
        })

        const update_typescript_dependencies = p_update_typescript_dependencies({
            'commands': {
                'git clean': git_clean,
                'update2latest': update2latest,
                'npm': npm,
            },
        })

        const update_dependencies = p_update_dependencies({
            'commands': {
                'update typescript dependencies': update_typescript_dependencies,
            },
        })

        const git_remove_tracked_but_ignored = p_git_remove_tracked_but_ignored({
            'queries': {
                'git': create_eqe(`git`, $r),
            },
            'commands': {
                'git': create_epe(`git`, $r),
                'assert git is clean': assert_git_is_clean,

            },
        })

        const git_extended_commit = p_git_extended_commit({
            'queries': {
                'git is clean': is_git_clean,
            },
            'commands': {
                'git': create_epe(`git`, $r),
            },
        })

        return p_bin({
            'commands': {
                'api': p_api({
                    'queries': {
                        'read directory': $r.queries['read directory']
                    },
                    'commands': {
                        'git assert clean': assert_git_is_clean,
                        'build and test': build_and_test,
                        'build': build,
                        'git remove tracked but ignored': git_remove_tracked_but_ignored,
                        'update dependencies': update_dependencies,
                        'git extended commit': git_extended_commit,
                    },
                }),
            },
        })
    }
)
