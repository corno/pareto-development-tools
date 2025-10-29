#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
// Get target directory from command line argument
const target_dir = process.argv[2];
if (!target_dir) {
    console.error('Error: Please provide a target directory path');
    console.error('Usage: pareto all list-loc <directory>');
    process.exit(1);
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
// Load structure.json
const structure_path = path.join(__dirname, '../../../..', 'data', 'structure.json');
if (!fs.existsSync(structure_path)) {
    console.error(`Error: structure.json not found at ${structure_path}`);
    process.exit(1);
}
const allowed_structure = JSON.parse(fs.readFileSync(structure_path, 'utf8'));
// Print CSV header
console.log('repository,path_in_repository,extension,loc,classification');
const count_lines = (file_path) => {
    try {
        const content = fs.readFileSync(file_path, 'utf8');
        return content.split('\n').length;
    }
    catch (err) {
        return 0;
    }
};
/**
 * Classify a path based on structure.json
 * Returns: 'generated', 'manual', 'unexpected', or null (for 'ignore')
 */
function classify_path(relative_path_parts, structure) {
    let current_structure = structure;
    for (let i = 0; i < relative_path_parts.length; i++) {
        const part = relative_path_parts[i];
        const is_last = i === relative_path_parts.length - 1;
        if (typeof current_structure !== 'object' || Array.isArray(current_structure)) {
            // We've hit a leaf node but path continues
            const [type, _] = current_structure || ['unexpected', null];
            if (type === 'ignore') {
                return null; // Don't list ignored files
            }
            else if (type === 'manual') {
                return 'manual'; // 'manual' allows anything
            }
            else if (type === 'generated') {
                return 'generated';
            }
            else if (type === 'warn') {
                return 'manual'; // warn patterns are still valid manual files
            }
            else if (type === 'wildcards') {
                return 'manual'; // wildcard patterns are manual
            }
            return 'unexpected';
        }
        // Check if exact match exists
        if (current_structure[part] !== undefined) {
            const value = current_structure[part];
            if (Array.isArray(value)) {
                const [type, details] = value;
                if (is_last) {
                    // This is the file/dir we're checking
                    if (type === 'ignore') {
                        return null; // Don't list ignored files
                    }
                    else if (type === 'generated') {
                        return 'generated';
                    }
                    else if (type === 'manual') {
                        // New format: check details, old format: details is null
                        return 'manual';
                    }
                    else if (type === 'file') {
                        // Old format for files
                        return 'manual';
                    }
                    else if (type === 'warn') {
                        return 'manual';
                    }
                    else if (type === 'wildcards') {
                        return 'manual';
                    }
                    return 'manual';
                }
                else {
                    // Path continues deeper
                    if (type === 'ignore') {
                        return null; // Don't list anything under ignored directories
                    }
                    else if (type === 'manual') {
                        // Manual directory allows anything deeper
                        return 'manual';
                    }
                    else if (type === 'generated') {
                        return 'generated'; // Everything under generated is generated
                    }
                    else if (type === 'warn') {
                        return 'manual';
                    }
                    else if (type === 'wildcards') {
                        return 'manual';
                    }
                    return 'unexpected'; // file type doesn't allow subdirectories
                }
            }
            else {
                // It's an object, continue traversing
                current_structure = value;
                continue;
            }
        }
        // Check wildcards (if current structure is an object)
        if (typeof current_structure === 'object' && !Array.isArray(current_structure)) {
            for (const [key, value] of Object.entries(current_structure)) {
                if (Array.isArray(value) && value[0] === 'wildcards') {
                    // Check if any wildcard pattern matches
                    const patterns = value[1];
                    const remaining_path = '/' + relative_path_parts.slice(i).join('/');
                    for (const pattern of patterns) {
                        if (matches_wildcard(remaining_path, pattern)) {
                            return 'manual';
                        }
                    }
                }
                if (Array.isArray(value) && value[0] === 'warn') {
                    const patterns = value[1];
                    const remaining_path = '/' + relative_path_parts.slice(i).join('/');
                    for (const pattern of patterns) {
                        if (matches_wildcard(remaining_path, pattern)) {
                            return 'manual';
                        }
                    }
                }
            }
        }
        // No match found
        return 'unexpected';
    }
    return 'manual';
}
/**
 * Simple wildcard matcher supporting * and **
 */
function matches_wildcard(file_path, pattern) {
    // Convert glob pattern to regex
    let regex_pattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*\*/g, '##DOUBLESTAR##')
        .replace(/\*/g, '[^/]*')
        .replace(/##DOUBLESTAR##/g, '.*');
    regex_pattern = '^' + regex_pattern + '$';
    const regex = new RegExp(regex_pattern);
    return regex.test(file_path);
}
const list_files_recursively = (dir_path, repository_name, relative_path_parts = []) => {
    try {
        const items = fs.readdirSync(dir_path, { withFileTypes: true });
        items.forEach(item => {
            const full_path = path.join(dir_path, item.name);
            const new_relative_parts = [...relative_path_parts, item.name];
            const relative_path = new_relative_parts.join('/');
            // Check classification first to see if we should skip
            const classification = classify_path(new_relative_parts, allowed_structure);
            // Skip ignored files/directories
            if (classification === null) {
                return;
            }
            if (item.isDirectory()) {
                list_files_recursively(full_path, repository_name, new_relative_parts);
            }
            else {
                const extension = path.extname(item.name);
                const loc = count_lines(full_path);
                console.log(`${repository_name},"${relative_path}","${extension}",${loc},${classification}`);
            }
        });
    }
    catch (err) {
        // Skip directories we can't read
    }
};
fs.readdirSync(base_dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .forEach(dirent => {
    const dir_path = path.join(base_dir, dirent.name);
    const package_json = path.join(dir_path, 'pub', 'package.json');
    if (fs.existsSync(package_json)) {
        list_files_recursively(dir_path, dirent.name);
    }
});
