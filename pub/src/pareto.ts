#!/usr/bin/env node
/**
 * Pareto - Main CLI entry point
 * 
 * Provides a unified command-line interface for all tools in this repository.
 * 
 * Usage: pareto <command> [options]
 * 
 * To enable bash completion, add to your ~/.bashrc:
 *   source /path/to/tools/completion/pareto-completion.bash
 */

const path = require('path');
const fs = require('fs');

const COMMANDS = {
    'publish': {
        module: './commands/publish',
        description: 'Publish a package with validation and testing'
    },
    'ensure-valid-commit': {
        module: './commands/ensure_valid_commit',
        description: 'Ensure repository has a valid latest commit'
    },
    'build': {
        module: './commands/build',
        description: 'Build a single package'
    },
    'cluster-build': {
        module: './commands/cluster/build',
        description: 'Build all packages in dependency order'
    },
    'test': {
        module: './commands/test',
        description: 'Run tests for a single package'
    },
    'cluster-test': {
        module: './commands/cluster/test',
        description: 'Run tests for all packages'
    },
    'clean': {
        module: './commands/clean',
        description: 'Clean build artifacts from a package'
    },
    'cluster-clean': {
        module: './commands/cluster/clean',
        description: 'Clean build artifacts from all packages'
    },
    'cluster-commit': {
        module: './commands/cluster/commit_and_push',
        description: 'Commit and push all packages with validation'
    },
    'cluster-ensure-valid-commits': {
        module: './commands/cluster/ensure_valid_commits',
        description: 'Ensure valid commits for all packages (topological order)'
    },
    'cluster-stage': {
        module: './commands/cluster/stage',
        description: 'Stage changes in all packages'
    },
    'update': {
        module: './commands/update',
        description: 'Update dependencies in a single package'
    },
    'cluster-update': {
        module: './commands/cluster/update',
        description: 'Update dependencies in all packages'
    },
    'compare': {
        module: './commands/compare',
        description: 'Compare local package with published version'
    },
    'validate-structure': {
        module: './commands/validate_structure',
        description: 'Validate that the repository structure does not deviate from the standard'
    },
    'check-interface-implementation': {
        module: './commands/check_interface_implementation',
        description: 'Compare interface/algorithms vs implementation structure'
    },
    'cluster-validate-structure': {
        module: './commands/cluster/validate_structure',
        description: 'for each repo in the directory; Validate that the repository structure does not deviate from the standard'
    },
    'cluster-wip': {
        module: './commands/cluster/wip',
        description: 'List work-in-progress packages (uncommitted/unpublished changes)'
    },
    'cluster-list-loc': {
        module: './commands/cluster/list_loc',
        description: 'List all files with line counts (CSV format)'
    },
    'cluster-dependency-graph': {
        module: './commands/cluster/dependency_graph',
        description: 'Generate and visualize dependency graph'
    },
    'analyse': {
        module: './commands/analyse',
        description: 'Analyze a package repository'
    },
    'cluster-analyse': {
        module: './commands/cluster/analyse',
        description: 'Analyze all package repositories in a cluster with colored output'
    },
    'cd-local': {
        module: './commands/cd-local',
        description: 'Change directory while staying within VS Code workspace bounds'
    }
};

function show_help() {
    console.log('Pareto - Package Development Tools\n');
    console.log('Usage: pareto <command> [options]\n');
    console.log('Available commands:\n');
    
    const max_length = Math.max(...Object.keys(COMMANDS).map(cmd => cmd.length));
    
    for (const [command, info] of Object.entries(COMMANDS)) {
        const padding = ' '.repeat(max_length - command.length + 2);
        console.log(`  ${command}${padding}${info.description}`);
    }
    
    console.log('\nUse "pareto <command> --help" for more information about a command.');
    console.log('\nTo enable bash completion, add to your ~/.bashrc:');
    console.log('  source /path/to/tools/completion/pareto-completion.bash');
}

// Parse arguments
const [,, command, subcommand, ...args] = process.argv;

// Handle 'cluster' prefix commands (e.g., 'pareto cluster build')
let effective_command = command;
let effective_args = subcommand ? [subcommand, ...args] : args;

if (command === 'cluster' && subcommand) {
    effective_command = `cluster-${subcommand}`;
    effective_args = args;
}

// Show help if no command or help flag
if (!command || command === '--help' || command === '-h' || command === 'help') {
    show_help();
    process.exit(0);
}

// Check if command exists
if (!COMMANDS[effective_command]) {
    if (command === 'cluster' && subcommand) {
        console.error(`Error: Unknown 'cluster' sub-command '${subcommand}'`);
        console.error(`\nAvailable cluster sub-commands: build, test, clean, commit, ensure-valid-commits, stage, update, validate-structure, wip, list-loc, dependency-graph, analyse`);
    } else {
        console.error(`Error: Unknown command '${command}'`);
    }
    console.error(`\nRun 'pareto --help' to see available commands.`);
    process.exit(1);
}

// Execute the command by requiring the module and calling its exported function
try {
    const command_module = require(COMMANDS[effective_command].module);
    const command_function = command_module.$$;
    
    if (typeof command_function !== 'function') {
        console.error(`Error: Command module ${effective_command} does not export a $$ function`);
        process.exit(1);
    }
    
    // Call the command function with the arguments (let each command handle its own path parsing)
    command_function(effective_args);
} catch (err) {
    console.error(`Error executing ${command}:`, err.message);
    process.exit(1);
}
