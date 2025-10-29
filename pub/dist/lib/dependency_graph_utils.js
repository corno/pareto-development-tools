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
/**
 * Read package.json and extract dependencies
 * @param {string} project_path - Path to the project directory
 * @param {boolean} include_dev_deps - Whether to include devDependencies
 * @returns {object} - Object containing project info and dependencies
 */
function get_project_dependencies(project_path, include_dev_deps = true) {
    const package_json_path = path.join(project_path, 'pub', 'package.json');
    try {
        const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const dependencies = {
            ...package_json.dependencies || {}
        };
        if (include_dev_deps) {
            Object.assign(dependencies, package_json.devDependencies || {});
        }
        return {
            name: package_json.name || path.basename(project_path),
            version: package_json.version || '0.0.0',
            dependencies: dependencies,
            prod_deps: Object.keys(package_json.dependencies || {}),
            dev_deps: Object.keys(package_json.devDependencies || {})
        };
    }
    catch (err) {
        console.error(`Error reading package.json in ${project_path}/pub:`, err.message);
        return {
            name: path.basename(project_path),
            version: '0.0.0',
            dependencies: {},
            prod_deps: [],
            dev_deps: []
        };
    }
}
/**
 * @typedef {Object} ProjectInfo
 * @property {string} name - Package name
 * @property {string} version - Package version
 * @property {string} dir_name - Directory name
 * @property {string} path - Full path to package
 * @property {Object.<string, string>} dependencies - Map of dependency names to versions
 * @property {string[]} prod_deps - List of production dependency names
 * @property {string[]} dev_deps - List of dev dependency names
 */
/**
 * @typedef {Object} DependencyGraph
 * @property {ProjectInfo[]} projects - All projects found
 * @property {Set<string>} sibling_projects - Set of sibling project names
 * @property {Map<string, string>} project_versions - Map of package names to versions
 * @property {Set<string>} external_deps - Set of external dependency names
 * @property {Map<string, string[]>} dependency_map - Map of project names to their sibling dependencies
 */
/**
 * Analyze dependencies in a directory containing multiple Node.js projects
 * @param {string} base_dir - Base directory containing projects
 * @param {boolean} include_dev_deps - Whether to include devDependencies
 * @returns {DependencyGraph} - Dependency graph information
 */
function analyze_dependencies(base_dir, include_dev_deps = true) {
    // Get all subdirectories that contain Node.js projects
    const projects = fs.readdirSync(base_dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
        const dir_path = path.join(base_dir, dirent.name);
        if (is_node_project(dir_path)) {
            return {
                dir_name: dirent.name,
                path: dir_path,
                ...get_project_dependencies(dir_path, include_dev_deps)
            };
        }
        return null;
    })
        .filter(project => project !== null);
    // Create a set of all sibling project names for quick lookup
    const sibling_projects = new Set(projects.map(p => p.name));
    // Create a map of project names to their versions
    const project_versions = new Map(projects.map(p => [p.name, p.version]));
    // Collect all external dependencies
    const external_deps = new Set();
    projects.forEach(project => {
        Object.keys(project.dependencies).forEach(dep => {
            if (!sibling_projects.has(dep)) {
                external_deps.add(dep);
            }
        });
    });
    // Build a dependency map (project name -> list of sibling dependencies)
    const dependency_map = new Map();
    projects.forEach(project => {
        const sibling_deps = Object.keys(project.dependencies)
            .filter(dep => sibling_projects.has(dep));
        dependency_map.set(project.name, sibling_deps);
    });
    return {
        projects,
        sibling_projects,
        project_versions,
        external_deps,
        dependency_map
    };
}
/**
 * Perform topological sort on projects based on their dependencies
 * Returns projects in build order (dependencies first)
 * @param {DependencyGraph} graph - Dependency graph from analyze_dependencies
 * @returns {ProjectInfo[]} - Projects sorted in dependency order
 * @throws {Error} - If circular dependencies are detected
 */
function get_build_order(graph) {
    const { projects, dependency_map } = graph;
    // Create a map of project names to project objects for quick lookup
    const project_by_name = new Map(projects.map(p => [p.name, p]));
    // Track visited nodes and current path for cycle detection
    const visited = new Set();
    const visiting = new Set();
    const sorted = [];
    function visit(project_name, path = []) {
        if (visiting.has(project_name)) {
            // Circular dependency detected
            const cycle_path = [...path, project_name];
            throw new Error(`Circular dependency detected: ${cycle_path.join(' -> ')}`);
        }
        if (visited.has(project_name)) {
            // Already processed
            return;
        }
        visiting.add(project_name);
        // Visit all dependencies first
        const deps = dependency_map.get(project_name) || [];
        for (const dep of deps) {
            visit(dep, [...path, project_name]);
        }
        visiting.delete(project_name);
        visited.add(project_name);
        // Add to sorted list (dependencies are already added)
        const project = project_by_name.get(project_name);
        if (project) {
            sorted.push(project);
        }
    }
    // Visit all projects
    for (const project of projects) {
        visit(project.name);
    }
    return sorted;
}
module.exports = {
    is_node_project,
    get_project_dependencies,
    analyze_dependencies,
    get_build_order
};
