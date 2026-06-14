import * as pqi from 'pareto-core/dist/query_interface'
import * as pci from 'pareto-core/dist/command_interface'

import * as resources from "./resources"
import * as resources_pareto from "pareto-resources/dist/interface/resources"
import * as resources_pareto_stream from "pareto-stream/dist/interface/resources"
import * as resources_git from "../modules/git/interface/resources"
import * as resources_npm from "../modules/npm/interface/resources"
import * as resources_fp from "pareto-fountain-pen-file-structure/dist/interface/resources"

export namespace queries {

    export type get_project_files = pqi.Query_Function<
        resources.queries.get_project_files,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

    export type get_package_dependencies = pqi.Query_Function<
        resources.queries.get_package_dependencies,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file

        }
    >

}

export namespace commands {

    export type analyze_file_structure = pci.Command_Procedure<
        resources.commands.analyze_file_structure,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type api = pci.Command_Procedure<
        resources.commands.api,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory
        },
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
        }
    >

    export type build = pci.Command_Procedure<
        resources.commands.build,
        null,
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        {
            'tsc': resources.commands.tsc
            'remove': resources_pareto.filesystem_unrestricted.commands.remove
            'chmod': resources_pareto.filesystem_unrestricted.commands.chmod
        }
    >

    export type build_and_test = pci.Command_Procedure<
        resources.commands.build_and_test,
        null,
        null,
        {
            'build': resources.commands.build
            'node': resources_pareto.execute_sandboxed.commands.command_executable
        }
    >

    export type create_dependency_graph = pci.Command_Procedure<
        resources.commands.create_dependency_graph,
        null,
        {
            'package dependencies': resources.queries.get_package_dependencies
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type git_commit = pci.Command_Procedure<
        resources.commands.git_commit,
        null,
        null,
        {
            'build and test': resources.commands.build_and_test
            'git extended commit': resources_git.commands.extended_commit
        }
    >

    export type list_file_structure_problems = pci.Command_Procedure<
        resources.commands.analyze_file_structure,
        null,
        {
            'read directory': resources_pareto.filesystem_unrestricted.queries.read_directory,
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'log': resources_pareto_stream.commands.log
        }
    >

    export type main = pci.Command_Procedure<
        resources_pareto.resources.commands.main,
        null,
        null,
        {
            'api': resources.commands.api
            'log error': resources_pareto_stream.commands.log_error

        }
    >

    export type publish = pci.Command_Procedure<
        resources.commands.publish,
        null,
        {
            'read file': resources_pareto.filesystem_unrestricted.queries.read_file
        },
        {
            'git push': resources_git.commands.push
            'git extended commit': resources_git.commands.extended_commit
            'git assert is clean': resources_git.commands.assert_is_clean
            'git make pristine': resources_git.commands.make_pristine
            'update package dependencies': resources.commands.update_package_dependencies
            'build and test': resources.commands.build_and_test
            'npm': resources_npm.commands.npm
            'npm publish': resources_npm.commands.npm_publish
            'log': resources_pareto_stream.commands.log
        }
    >

    export type tsc = pci.Command_Procedure<
        resources.commands.tsc,
        null,
        null,
        {
            'tsc': resources_pareto.execute_sandboxed.commands.smelly_command_executable
        }
    >

    export type update_package_dependencies = pci.Command_Procedure<
        resources.commands.update_package_dependencies,
        null,
        {
            'stat': resources_pareto.filesystem_unrestricted.queries.stat_possible_node
        },
        {
            'npm update package dependencies': resources_npm.commands.update_package_dependencies
        }
    >
}