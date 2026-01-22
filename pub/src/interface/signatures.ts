import * as _pi from 'pareto-core/dist/interface'

import * as resources from "./resources"
import * as resources_exupery from "pareto-resources/dist/interface/resources"
import * as resources_git from "../modules/git/interface/resources"
import * as resources_npm from "../modules/npm/interface/resources"
import * as resources_fp from "../modules/pareto-fountain-pen-directory/interface/resources"

export namespace queries {

    export type get_package_dependencies = _pi.Query_Function<
        resources.queries.get_package_dependencies,
        {
            'read directory': resources_exupery.queries.read_directory,
            'read file': resources_exupery.queries.read_file

        }
    >

}

export namespace commands {

    export type analyze_file_structure = _pi.Command_Procedure<
        resources.commands.analyze_file_structure,
        {
            'log': resources_exupery.commands.log
        },
        {
            'read directory': resources_exupery.queries.read_directory,
            'read file': resources_exupery.queries.read_file

        }
    >

    export type api = _pi.Command_Procedure<
        resources.commands.api,
        {
            'analyze file structure': resources.commands.analyze_file_structure
            'build and test': resources.commands.build_and_test
            'build': resources.commands.build
            'create dependency graph': resources.commands.create_dependency_graph
            'git assert is clean': resources_git.commands.assert_is_clean
            'git extended commit': resources_git.commands.extended_commit
            'git remove tracked but ignored': resources_git.commands.remove_tracked_but_ignored
            'list file structure problems': resources.commands.analyze_file_structure
            'npm set up comparison against published': resources_npm.commands.set_up_comparison_against_published
            'publish': resources.commands.publish
            'update package dependencies': resources.commands.update_package_dependencies
        },
        {
            'read directory': resources_exupery.queries.read_directory
        }
    >

    export type build = _pi.Command_Procedure<
        resources.commands.build,
        {
            'tsc': resources.commands.tsc
            'remove': resources_exupery.commands.remove
        },
        null
    >

    export type build_and_test = _pi.Command_Procedure<
        resources.commands.build_and_test,
        {
            'build': resources.commands.build
            'node': resources_exupery.commands.execute_command_executable
        },
        null
    >

    export type create_dependency_graph = _pi.Command_Procedure<
        resources.commands.create_dependency_graph,
        {
            'log': resources_fp.commands.console_log
        },
        {
            'package dependencies': resources.queries.get_package_dependencies
        }
    >

    export type list_file_structure_problems = _pi.Command_Procedure<
        resources.commands.analyze_file_structure,
        {
            'log': resources_exupery.commands.log
        },
        {
            'read directory': resources_exupery.queries.read_directory
            'read file': resources_exupery.queries.read_file
        }
    >

    export type main = _pi.Command_Procedure<
        resources_exupery.commands.main,
        {
            'api': resources.commands.api
            'log error': resources_exupery.commands.log_error

        },
        null
    >

    export type tsc = _pi.Command_Procedure<
        resources.commands.tsc,
        {
            'tsc': resources_exupery.commands.execute_smelly_command_executable
        },
        null
    >

    export type publish = _pi.Command_Procedure<
        resources.commands.publish,
        {
            'git push': resources_git.commands.push
            'git assert is clean': resources_git.commands.assert_is_clean
            'git make pristine': resources_git.commands.make_pristine
            'update package dependencies': resources.commands.update_package_dependencies
            'build and test': resources.commands.build_and_test
            'npm': resources_npm.commands.npm
            'npm publish': resources_npm.commands.npm_publish
        },
        null
    >

    export type update_package_dependencies = _pi.Command_Procedure<
        resources.commands.update_package_dependencies,
        {
            'npm update package dependencies': resources_npm.commands.update_package_dependencies
        },
        null
    >
}