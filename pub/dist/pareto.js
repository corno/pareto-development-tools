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
const { spawn } = require('child_process');
const COMMANDS = {
    'publish': {
        file: './commands/publish.js',
        description: 'Publish a package with validation and testing'
    },
    'ensure-valid-commit': {
        file: './commands/ensure_valid_commit.js',
        description: 'Ensure repository has a valid latest commit'
    },
    'build': {
        file: './commands/build.js',
        description: 'Build a single package'
    },
    'all-build': {
        file: './commands/all/build.js',
        description: 'Build all packages in dependency order'
    },
    'test': {
        file: './commands/test.js',
        description: 'Run tests for a single package'
    },
    'all-test': {
        file: './commands/all/test.js',
        description: 'Run tests for all packages'
    },
    'clean': {
        file: './commands/clean.js',
        description: 'Clean build artifacts from a package'
    },
    'all-clean': {
        file: './commands/all/clean.js',
        description: 'Clean build artifacts from all packages'
    },
    'all-commit': {
        file: './commands/all/commit_and_push.js',
        description: 'Commit and push all packages with validation'
    },
    'all-ensure-valid-commits': {
        file: './commands/all/ensure_valid_commits.js',
        description: 'Ensure valid commits for all packages (topological order)'
    },
    'all-stage': {
        file: './commands/all/stage.js',
        description: 'Stage changes in all packages'
    },
    'update': {
        file: './commands/update.js',
        description: 'Update dependencies in a single package'
    },
    'all-update': {
        file: './commands/all/update.js',
        description: 'Update dependencies in all packages'
    },
    'compare': {
        file: './commands/compare.js',
        description: 'Compare local package with published version'
    },
    'validate-structure': {
        file: './commands/validate_structure.js',
        description: 'Validate that the repository structure does not deviate from the standard'
    },
    'all-validate-structure': {
        file: './commands/all/validate_structure.js',
        description: 'for each repo in the directory; Validate that the repository structure does not deviate from the standard'
    },
    'all-wip': {
        file: './commands/all/wip.js',
        description: 'List work-in-progress packages (uncommitted/unpublished changes)'
    },
    'all-list-loc': {
        file: './commands/all/list_loc.js',
        description: 'List all files with line counts (CSV format)'
    },
    'all-dependency-graph': {
        file: './commands/all/dependency_graph.js',
        description: 'Generate and visualize dependency graph'
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
const [, , command, subcommand, ...args] = process.argv;
// Handle 'all' prefix commands (e.g., 'pareto all build')
let effective_command = command;
let effective_args = subcommand ? [subcommand, ...args] : args;
if (command === 'all' && subcommand) {
    effective_command = `all-${subcommand}`;
    effective_args = args;
}
// Show help if no command or help flag
if (!command || command === '--help' || command === '-h' || command === 'help') {
    show_help();
    process.exit(0);
}
// Check if command exists
if (!COMMANDS[effective_command]) {
    if (command === 'all' && subcommand) {
        console.error(`Error: Unknown 'all' sub-command '${subcommand}'`);
        console.error(`\nAvailable 'all' sub-commands: build, test, clean, commit, ensure-valid-commits, stage, update, validate-structure, wip, list-loc, dependency-graph`);
    }
    else {
        console.error(`Error: Unknown command '${command}'`);
    }
    console.error(`\nRun 'pareto --help' to see available commands.`);
    process.exit(1);
}
// Execute the command by spawning the corresponding script
const script_path = path.join(__dirname, COMMANDS[effective_command].file);
const child = spawn('node', [script_path, ...effective_args], {
    stdio: 'inherit',
    cwd: process.cwd()
});
child.on('exit', (code) => {
    process.exit(code || 0);
});
child.on('error', (err) => {
    console.error(`Error executing ${command}:`, err.message);
    process.exit(1);
});
