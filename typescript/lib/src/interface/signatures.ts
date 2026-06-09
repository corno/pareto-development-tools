import * as _pi from 'pareto-core/dist/interface'

import * as resources from "./resources"
import * as resources_pareto from "pareto-resources/dist/interface/resources"
import * as resources_git from "../modules/git/interface/resources"
import * as resources_npm from "../modules/npm/interface/resources"
import * as resources_fp from "pareto-fountain-pen-file-structure/dist/interface/resources"

export namespace queries {

    export type get_project_files = _pi.Query_Function<
        resources.queries.get_project_files,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        },
        null
    >

    export type get_package_dependencies = _pi.Query_Function<
        resources.queries.get_package_dependencies,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        },
        null
    >

}

export namespace commands {

    export type analyze_file_structure = _pi.Command_Procedure<
        resources.commands.analyze_file_structure,
        {
            'log': resources_pareto.stream.commands.log
        },
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        null
    >

    export type api = _pi.Command_Procedure<
        resources.commands.api,
        {
            'analyze file structure': resources.commands.analyze_file_structure
            'build and test': resources.commands.build_and_test
            'build': resources.commands.build
            'create dependency graph': resources.commands.create_dependency_graph
            'git assert is clean': resources_git.commands.assert_is_clean
            'git commit': resources.commands.git_commit
            'git remove tracked but ignored': resources_git.commands.remove_tracked_but_ignored
            'list file structure problems': resources.commands.analyze_file_structure
            'npm set up comparison against published': resources_npm.commands.set_up_comparison_against_published
            'publish': resources.commands.publish
            'update package dependencies': resources.commands.update_package_dependencies
        },
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory
        },
        null
    >

    export type build = _pi.Command_Procedure<
        resources.commands.build,
        {
            'tsc': resources.commands.tsc
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'chmod': resources_pareto.filesystem_unrestricted.commands.chmod
        },
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        null
    >

    export type build_and_test = _pi.Command_Procedure<
        resources.commands.build_and_test,
        {
            'build': resources.commands.build
            'node': resources_pareto.execute_sandboxed.commands.command_executable
        },
        null,
        null
    >

    export type create_dependency_graph = _pi.Command_Procedure<
        resources.commands.create_dependency_graph,
        {
            'log': resources_pareto.stream.commands.log
        },
        {
            'package dependencies': resources.queries.get_package_dependencies
        },
        null
    >

    export type git_commit = _pi.Command_Procedure<
        resources.commands.git_commit,
        {
            'build and test': resources.commands.build_and_test
            'git extended commit': resources_git.commands.extended_commit
        },
        null,
        null
    >

    export type list_file_structure_problems = _pi.Command_Procedure<
        resources.commands.analyze_file_structure,
        {
            'log': resources_pareto.stream.commands.log
        },
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        null
    >

    export type main = _pi.Command_Procedure<
        resources_pareto.resources.commands.main,
        {
            'api': resources.commands.api
            'log error': resources_pareto.stream.commands.log_error

        },
        null,
        null
    >

    export type publish = _pi.Command_Procedure<
        resources.commands.publish,
        {
            'git push': resources_git.commands.push
            'git extended commit': resources_git.commands.extended_commit
            'git assert is clean': resources_git.commands.assert_is_clean
            'git make pristine': resources_git.commands.make_pristine
            'update package dependencies': resources.commands.update_package_dependencies
            'build and test': resources.commands.build_and_test
            'npm': resources_npm.commands.npm
            'npm publish': resources_npm.commands.npm_publish
            'log': resources_pareto.stream.commands.log
        },
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        null
    >

    export type tsc = _pi.Command_Procedure<
        resources.commands.tsc,
        {
            'tsc': resources_pareto.execute_sandboxed.commands.smelly_command_executable
        },
        null,
        null
    >

    export type update_package_dependencies = _pi.Command_Procedure<
        resources.commands.update_package_dependencies,
        {
            'npm update package dependencies': resources_npm.commands.update_package_dependencies
        },
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        null
    >
}