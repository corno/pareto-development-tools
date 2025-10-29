"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_node_project = is_node_project;
const fs = require('fs');
const path = require('path');
/**
 * Check if a directory contains a valid Node.js project
 * @param {string} project_path - Path to check
 * @returns {boolean} - True if directory contains package.json in pub subdirectory
 */
function is_node_project(project_path) {
    return fs.existsSync(path.join(project_path, 'pub', 'package.json'));
}
