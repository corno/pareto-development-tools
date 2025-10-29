"use strict";
/**
 * Repository Structure Validation Function
 *
 * This function validates a repository's structure against the structure.json schema.
 *
 * VALIDATION:
 * ===========
 * - Checks that all files in the repository match the allowed structure
 * - Identifies unexpected files and missing required files
 * - Separates issues into warnings (non-blocking) and errors (blocking)
 *
 * RETURN TYPES:
 * =============
 * - ['valid', { warnings }]               - Structure is valid, may have warnings
 * - ['not valid', { errors, warnings }]   - Structure has errors (blocking issues)
 *
 * @param {string} repo_path - Path to the repository
 * @param {object} structure - Structure definition from structure.json
 * @returns {Status} - Status tuple indicating result
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$ = void 0;
const fs = require('fs');
const path = require('path');
/**
 * Match a path component against a wildcard pattern
 * @param {string} pattern_part - Pattern part (may contain *)
 * @param {string} path_part - Actual path component
 * @returns {boolean} - True if matches
 */
function match_pattern_part(pattern_part, path_part) {
    if (pattern_part === '*') {
        return true; // Single * matches any single component
    }
    // Convert pattern to regex
    const regex_pattern = pattern_part
        .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars except *
        .replace(/\*/g, '.*'); // Convert * to .*
    const regex = new RegExp(`^${regex_pattern}$`);
    return regex.test(path_part);
}
/**
 * Check if a relative path matches a wildcard pattern
 * @param {string} relative_path - Path relative to directory (e.g., "src/bin/test.ts")
 * @param {string} pattern - Wildcard pattern (e.g., "/*.ts", "/**​/*.ts")
 * @returns {boolean} - True if path matches pattern
 */
function matches_wildcard(relative_path, pattern) {
    // Split both pattern and path into components
    const pattern_parts = pattern.split('/').filter(p => p !== '');
    const path_parts = relative_path.split('/').filter(p => p !== '');
    // Handle ** (matches any number of directories)
    let pattern_idx = 0;
    let path_idx = 0;
    while (pattern_idx < pattern_parts.length && path_idx < path_parts.length) {
        const pattern_part = pattern_parts[pattern_idx];
        const path_part = path_parts[path_idx];
        if (pattern_part === '**') {
            // ** can match zero or more path components
            // Try to match the rest of the pattern after **
            if (pattern_idx === pattern_parts.length - 1) {
                // ** is the last part, matches everything remaining
                return true;
            }
            // Try matching from current position forward
            const remaining_pattern = pattern_parts.slice(pattern_idx + 1).join('/');
            for (let i = path_idx; i < path_parts.length; i++) {
                const remaining_path = path_parts.slice(i).join('/');
                if (matches_wildcard(remaining_path, remaining_pattern)) {
                    return true;
                }
            }
            return false;
        }
        else if (match_pattern_part(pattern_part, path_part)) {
            pattern_idx++;
            path_idx++;
        }
        else {
            return false;
        }
    }
    // Both should be exhausted for a complete match
    return pattern_idx === pattern_parts.length && path_idx === path_parts.length;
}
/**
 * Get all files and directories in a path, checking against structure
 * @param {string} dir_path - Directory path
 * @param {string} relative_path - Relative path from repository root
 * @param {any} structure - Structure definition for this level
 * @param {string} repo_path - Root repository path for error messages
 * @param {string} wildcard_base_path - Path relative to where wildcard pattern started
 * @returns {Array} - Array of issue tuples ['error'|'warning', ['type', ...details]]
 */
function get_file_tree(dir_path, relative_path = '', structure = null, repo_path = '', wildcard_base_path = '') {
    const issues = [];
    // Structure must be either an object or an array (tuple)
    if (typeof structure === 'object' && structure !== null && !Array.isArray(structure)) {
        // Object: contains named entries (files/directories)
        // Process each file/directory in this directory
        try {
            const entries = fs.readdirSync(dir_path, { withFileTypes: true });
            for (const entry of entries) {
                const item_relative_path = relative_path ? path.join(relative_path, entry.name) : entry.name;
                const item_full_path = path.join(dir_path, entry.name);
                // Check if entry is defined in structure
                if (entry.name in structure) {
                    const item_structure = structure[entry.name];
                    // Check if it's an array (tuple format)
                    if (Array.isArray(item_structure)) {
                        const [type, details] = item_structure;
                        if (entry.isDirectory()) {
                            // For directories, check what's expected
                            if (type === 'manual' && details && details[0] === 'file') {
                                // Expected a file but found a directory
                                issues.push(['error', ['expected-file-found-directory', path.join(repo_path, item_relative_path)]]);
                            }
                            else {
                                // Recurse into the directory
                                const nested_issues = get_file_tree(item_full_path, item_relative_path, item_structure, repo_path, '');
                                issues.push(...nested_issues);
                            }
                        }
                        else {
                            // It's a file - validate against expected type
                            if (type === 'manual' && details && details[0] === 'directory') {
                                // Expected a directory but found a file
                                issues.push(['error', ['expected-directory-found-file', path.join(repo_path, item_relative_path)]]);
                            }
                            else if (type === 'manual' && details && details[0] === 'file') {
                                // Correct: manual file
                            }
                            else if (type === 'generated') {
                                // Correct: generated file
                            }
                            else if (type === 'wildcards' || type === 'warn') {
                                // These are for directories with patterns, not individual files
                                issues.push(['error', ['unexpected-file-in-pattern-directory', path.join(repo_path, item_relative_path)]]);
                            }
                        }
                    }
                    else {
                        // It's a nested object, recurse if it's a directory
                        if (entry.isDirectory()) {
                            const nested_issues = get_file_tree(item_full_path, item_relative_path, item_structure, repo_path, '');
                            issues.push(...nested_issues);
                        }
                        else {
                            // File found where object structure was expected
                            issues.push(['error', ['expected-directory-found-file', path.join(repo_path, item_relative_path)]]);
                        }
                    }
                }
                else {
                    // Entry not found in structure - report error
                    const issue_type = entry.isDirectory() ? 'unexpected-directory' : 'unexpected-file';
                    issues.push(['error', [issue_type, path.join(repo_path, item_relative_path)]]);
                }
            }
        }
        catch (err) {
            console.error(`Error reading directory ${dir_path}:`, err.message);
        }
    }
    else if (Array.isArray(structure)) {
        // Tuple: special structure type
        const structure_type = structure[0];
        switch (structure_type) {
            case 'manual': {
                // ["manual", ["directory", null]] or ["manual", ["file", null]]
                const details = structure[1];
                if (details && details[0] === 'directory') {
                    // Allow any content in this directory, don't validate further
                }
                else if (details && details[0] === 'file') {
                    // This is a manually maintained file, no children expected
                }
                else {
                    // Old format: ["manual", null] - treat as directory
                    // Allow any content, don't validate
                }
                break;
            }
            case 'ignore':
                // ["ignore", null] - ignore this directory/file completely
                break;
            case 'generated':
                // ["generated", null] - allow any content (generated files), don't validate
                break;
            case 'file':
                // Old format: ["file", null] - this is a file, shouldn't have children
                // If we're here, the parent tried to recurse into a file, which is wrong
                // But this shouldn't happen in normal flow
                break;
            case 'wildcards':
            case 'warn': {
                // ["wildcards", [...]] or ["warn", [...]] - pattern matching
                const patterns = structure[1];
                const severity = structure_type === 'warn' ? 'warning' : 'error';
                try {
                    const entries = fs.readdirSync(dir_path, { withFileTypes: true });
                    for (const entry of entries) {
                        const item_relative_path = relative_path ? path.join(relative_path, entry.name) : entry.name;
                        const item_full_path = path.join(dir_path, entry.name);
                        // Build path relative to where wildcard pattern started
                        const check_path = wildcard_base_path ? path.join(wildcard_base_path, entry.name) : entry.name;
                        let is_allowed = false;
                        if (entry.isDirectory()) {
                            // For directories, check if pattern allows subdirectories
                            for (const pattern of patterns) {
                                if (pattern.includes('**') || pattern.includes('/*')) {
                                    is_allowed = true;
                                    break;
                                }
                            }
                            if (is_allowed) {
                                // Recurse with same wildcard structure, continuing to build path
                                const nested_issues = get_file_tree(item_full_path, item_relative_path, structure, repo_path, check_path);
                                issues.push(...nested_issues);
                            }
                            else {
                                // Directory not allowed by patterns
                                issues.push([severity, ['wildcard-directory-mismatch', path.join(repo_path, item_relative_path), patterns]]);
                            }
                        }
                        else {
                            // For files, check if pattern matches
                            for (const pattern of patterns) {
                                if (matches_wildcard(check_path, pattern)) {
                                    is_allowed = true;
                                    break;
                                }
                            }
                            if (!is_allowed) {
                                // File doesn't match any pattern
                                issues.push([severity, ['wildcard-file-mismatch', path.join(repo_path, item_relative_path), patterns]]);
                            }
                        }
                    }
                }
                catch (err) {
                    console.error(`Error reading directory ${dir_path}:`, err.message);
                }
                break;
            }
            default:
                console.error(`Unknown structure type: ${structure_type}`);
        }
    }
    else {
        // Invalid structure type
        console.error(`Invalid structure type at ${relative_path}: ${typeof structure}`);
    }
    return issues;
}
const $$ = (repo_path, structure) => {
    // Scan the repository and collect issues
    const issues = get_file_tree(repo_path, '', structure, repo_path);
    if (issues.length > 0) {
        const errors = issues
            .filter((issue) => issue[0] === 'error')
            .map((issue) => issue[1][1]);
        const warnings = issues
            .filter((issue) => issue[0] === 'warning')
            .map((issue) => issue[1][1]);
        if (errors.length > 0) {
            return ['not valid', {
                    errors: errors,
                    warnings: warnings
                }];
        }
        return ['valid', {
                warnings: warnings
            }];
    }
    return ['valid', {
            warnings: []
        }];
};
exports.$$ = $$;
