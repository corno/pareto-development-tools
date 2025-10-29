#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { is_node_project } = require('../../lib/build_test_utils');
const { $$ } = require('../../lib/build_and_test');
// Get target directory from command line argument (skip --silent flag)
const args = process.argv.slice(2);
const target_dir = args.find(arg => !arg.startsWith('--'));
if (!target_dir) {
    console.error('Error: Please provide a target directory path');
    console.error('Usage: pareto all test <directory> [--silent]');
    process.exit(1);
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
// Check for --verbose argument
const silent = process.argv.includes('--silent');
// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};
fs.readdirSync(base_dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
    const dir_path = path.join(base_dir, dirent.name);
    if (is_node_project(dir_path)) {
        console.log(`Building and testing ${get_relative_path(dir_path)}...`);
        try {
            const result = $$(dir_path, {
                verbose: !silent,
                throw_on_error: false
            });
            if (result[0] === 'success') {
                console.log(`✓ ${get_relative_path(dir_path)} build and tests passed`);
            }
            else {
                const [_, details] = result;
                const [reason_type, reason_details] = details.reason;
                if (reason_type === 'build failing') {
                    console.error(`❌ ${get_relative_path(dir_path)} build failed`);
                }
                else if (reason_type === 'tests failing') {
                    console.error(`❌ ${get_relative_path(dir_path)} tests failed`);
                }
            }
        }
        catch (err) {
            console.error(`❌ Build/test failed in ${get_relative_path(dir_path)}:`, err.message);
        }
    }
});
