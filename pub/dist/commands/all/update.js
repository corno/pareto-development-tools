#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// Get target directory from command line argument
const target_dir = process.argv[2];
if (!target_dir) {
    console.error('Error: Please provide a target directory path');
    console.error('Usage: pareto all update <directory>');
    process.exit(1);
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};
fs.readdirSync(base_dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
    const dir_path = path.join(base_dir, dirent.name);
    const package_json = path.join(dir_path, 'pub', 'package.json');
    if (fs.existsSync(package_json)) {
        console.log(`Updating ${get_relative_path(dir_path)}...`);
        try {
            execSync('update2latest . dependencies', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
            // execSync('update2latest . devDependencies', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
            execSync('npm update', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
        }
        catch (err) {
            console.error(`Failed to update ${get_relative_path(dir_path)}:`, err.message);
        }
    }
});
