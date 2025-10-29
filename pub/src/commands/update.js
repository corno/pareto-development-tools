#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get package directory from command line argument (default to current directory)
const package_dir = process.argv[2] || '.';
const package_path = path.resolve(package_dir);

// Check if package.json exists in pub directory
const package_json_path = path.join(package_path, 'pub', 'package.json');

if (!fs.existsSync(package_json_path)) {
    console.error(`Error: package.json not found in ${package_path}/pub`);
    console.error('Usage: pareto update [package-directory]');
    process.exit(1);
}

const package_name = path.basename(package_path);

console.log(`Updating dependencies for ${package_name}...`);

try {
    const pub_dir = path.join(package_path, 'pub');
    
    // Update to latest versions
    console.log('\nUpdating to latest compatible versions...');
    execSync('update2latest . dependencies', { cwd: pub_dir, stdio: 'inherit' });
    
    // Run npm update
    console.log('\nRunning npm update...');
    execSync('npm update', { cwd: pub_dir, stdio: 'inherit' });
    
    console.log(`\n✓ Successfully updated dependencies for ${package_name}`);
} catch (err) {
    console.error(`\n❌ Failed to update ${package_name}:`, err.message);
    process.exit(1);
}
