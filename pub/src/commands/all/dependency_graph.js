#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { analyze_dependencies } = require('../../lib/dependency_graph_utils');

// Get target directory from command line argument
const args = process.argv.slice(2);

// Parse flags first
const include_dev_deps = args.includes('--include-dev') || args.includes('-d');
const verbose = args.includes('--verbose') || args.includes('-v');
const show_path = args.includes('--show-path') || args.includes('-p');
const show_command = args.includes('--show-command') || args.includes('-c');
const output_dot = args.includes('--dot'); // Changed: now DOT requires explicit flag
const show_legend = args.includes('--legend') || args.includes('-l');
const skip_publish_compare = args.includes('--skip-publish-compare');
const output_svg = !output_dot; // Changed: SVG is now default

// Filter out flags to get positional arguments
const positional_args = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
const target_dir = positional_args[0];

// Default output file
let output_file;
if (positional_args.length === 1) {
    // Default to SVG extension
    output_file = output_svg ? 'dependencies.svg' : 'dependencies.dot';
} else {
    output_file = positional_args[1];
}

if (!target_dir || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: pareto all dependency-graph <directory> [output_file] [options]');
    console.log('');
    console.log('Generates an SVG dependency graph by default and opens it automatically.');
    console.log('');
    console.log('Options:');
    console.log('  --include-dev, -d        Include devDependencies (default: includes both)');
    console.log('  --verbose, -v            Show verbose output');
    console.log('  --dot                    Output DOT format instead of SVG format');
    console.log('  --legend, -l             Include legend in the graph');
    console.log('  --skip-publish-compare   Skip checking if packages are in sync with published versions');
    console.log('  --show-path, -p          Show file path after generation (skips auto-open)');
    console.log('  --show-command, -c       Show command to open it (skips auto-open)');
    console.log('  --help, -h               Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  generate_dependency_graph.js ../my-repos');
    console.log('  generate_dependency_graph.js ../my-repos deps.svg --verbose');
    console.log('  generate_dependency_graph.js ../my-repos deps.dot --dot');
    
    if (!target_dir) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

const base_dir = path.resolve(target_dir);

if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}

console.log(`Analyzing dependencies in ${target_dir}...`);
if (verbose) {
    console.log(`Include dev dependencies: ${include_dev_deps}`);
}

// Analyze dependencies using the library function
const dep_graph = analyze_dependencies(base_dir, include_dev_deps);
const { projects, sibling_projects, project_versions, external_deps } = dep_graph;

if (projects.length === 0) {
    console.error('No Node.js projects found in the specified directory');
    process.exit(1);
}

/**
 * Escape a string for GraphViz dot format
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escape_dot_string(str) {
    return str.replace(/"/g, '\\"');
}

/**
 * Generate a safe node ID for GraphViz
 * @param {string} name - Package name
 * @returns {string} - Safe node ID
 */
function safe_node_id(name) {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Check if a package is in sync with its published version
 * @param {string} package_path - Path to the package directory
 * @param {string} package_name - Name of the package
 * @param {string} package_version - Local version of the package
 * @param {boolean} verbose - Show verbose output
 * @returns {boolean} - True if package is in sync with published version
 */
function is_package_in_sync(package_path, package_name, package_version, verbose = false) {
    try {
        const { execSync } = require('child_process');
        const os = require('os');
        const fs = require('fs');
        
        // Check if package exists on npm
        let published_info;
        try {
            const npm_view_output = execSync(`npm view ${package_name} version`, { 
                stdio: 'pipe', 
                encoding: 'utf8' 
            }).trim();
            
            if (!npm_view_output || npm_view_output.includes('npm ERR!')) {
                if (verbose) {
                    console.log(`  - ${package_name}: Not published`);
                }
                return false; // Not published = not in sync
            }
            
            const published_version = npm_view_output.trim();
            
            if (published_version !== package_version) {
                if (verbose) {
                    console.log(`  - ${package_name}: Version mismatch (local: ${package_version}, published: ${published_version})`);
                }
                return false; // Version mismatch = not in sync
            }
            
        } catch (npmError) {
            if (verbose) {
                console.log(`  - ${package_name}: Failed to check npm registry`);
            }
            return false; // Can't check = assume not in sync
        }
        
        // Create temporary directories for comparison
        const temp_dir = fs.mkdtempSync(path.join(os.tmpdir(), `sync-check-${package_name.replace(/[^a-zA-Z0-9]/g, '_')}-`));
        const published_dir = path.join(temp_dir, 'published');
        const local_dir = path.join(temp_dir, 'local');
        
        try {
            // Extract published package
            fs.mkdirSync(published_dir, { recursive: true });
            execSync(`npm pack ${package_name}`, {
                cwd: published_dir,
                stdio: 'pipe'
            });
            
            const tgz_files = fs.readdirSync(published_dir).filter(file => file.endsWith('.tgz'));
            if (tgz_files.length > 0) {
                execSync(`tar -xzf "${tgz_files[0]}"`, {
                    cwd: published_dir,
                    stdio: 'pipe'
                });
                
                // Move contents from package/ subdirectory to published_dir
                const package_sub_dir = path.join(published_dir, 'package');
                if (fs.existsSync(package_sub_dir)) {
                    const files = fs.readdirSync(package_sub_dir);
                    files.forEach(file => {
                        const source_file_path = path.join(package_sub_dir, file);
                        const dest_path = path.join(published_dir, file);
                        if (fs.existsSync(dest_path)) {
                            fs.rmSync(dest_path, { recursive: true, force: true });
                        }
                        fs.renameSync(source_file_path, dest_path);
                    });
                    fs.rmSync(package_sub_dir, { recursive: true });
                }
                fs.unlinkSync(path.join(published_dir, tgz_files[0]));
            }
            
            // Create local package
            fs.mkdirSync(local_dir, { recursive: true });
            execSync(`npm pack "${path.join(package_path, 'pub')}"`, {
                cwd: local_dir,
                stdio: 'pipe'
            });
            
            const local_tgz_files = fs.readdirSync(local_dir).filter(file => file.endsWith('.tgz'));
            if (local_tgz_files.length > 0) {
                execSync(`tar -xzf "${local_tgz_files[0]}"`, {
                    cwd: local_dir,
                    stdio: 'pipe'
                });
                
                // Move contents from package/ subdirectory
                const local_package_sub_dir = path.join(local_dir, 'package');
                if (fs.existsSync(local_package_sub_dir)) {
                    const files = fs.readdirSync(local_package_sub_dir);
                    files.forEach(file => {
                        const source_file_path = path.join(local_package_sub_dir, file);
                        const dest_path = path.join(local_dir, file);
                        if (fs.existsSync(dest_path)) {
                            fs.rmSync(dest_path, { recursive: true, force: true });
                        }
                        fs.renameSync(source_file_path, dest_path);
                    });
                    fs.rmSync(local_package_sub_dir, { recursive: true });
                }
                fs.unlinkSync(path.join(local_dir, local_tgz_files[0]));
            }
            
            // Compare the directories
            try {
                execSync(`diff -r "${published_dir}" "${local_dir}"`, {
                    stdio: 'pipe'
                });
                
                if (verbose) {
                    console.log(`  - ${package_name}: In sync`);
                }
                return true; // Identical = in sync
                
            } catch (diffError) {
                if (verbose) {
                    console.log(`  - ${package_name}: Content differs from published version`);
                }
                return false; // Different = not in sync
            }
            
        } finally {
            // Clean up temp directory
            if (fs.existsSync(temp_dir)) {
                fs.rmSync(temp_dir, { recursive: true, force: true });
            }
        }
        
    } catch (err) {
        if (verbose) {
            console.log(`  - ${package_name}: Error checking sync status: ${err.message}`);
        }
        return false; // Error = assume not in sync
    }
}

// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};

console.log(`Found ${projects.length} projects:`);
projects.forEach(project => {
    const dep_count = Object.keys(project.dependencies).length;
    const info = verbose ? ` (${project.prod_deps.length} prod, ${project.dev_deps.length} dev deps)` : '';
    
    // Check if package name matches directory name
    const name_mismatch = project.name !== project.dir_name;
    const warning = name_mismatch ? ' ⚠️  (name mismatch)' : '';
    
    console.log(`  - ${get_relative_path(project.path)}${info}${warning}`);
    
    if (name_mismatch) {
        console.log(`    ⚠️  Warning: Package name '${project.name}' doesn't match directory name '${project.dir_name}'`);
    }
});

// =============================================================================
// PHASE 1: DETERMINE STATUS OF ALL PACKAGES AND DEPENDENCIES
// =============================================================================

/**
 * @typedef {Object} PackageStatus
 * @property {string} name - Package name
 * @property {string} version - Package version
 * @property {string} dir_name - Directory name
 * @property {string} path - Full path to package
 * @property {boolean} is_in_sync - Whether package is in sync with published version
 * @property {Object.<string, string>} dependencies - Map of dependency names to versions
 * @property {string[]} prod_deps - List of production dependency names
 * @property {string[]} dev_deps - List of dev dependency names
 */

/**
 * @typedef {Object} DependencyEdge
 * @property {string} from - Source package name
 * @property {string} to - Target package name
 * @property {string} version - Required version
 * @property {boolean} is_sibling - Whether target is a sibling package
 * @property {boolean} is_dev_dep - Whether this is a dev dependency
 * @property {boolean} has_version_mismatch - Whether version doesn't match actual version
 * @property {'blue'|'yellow'|'red'} color - Edge color
 */

/**
 * @typedef {Object} GraphData
 * @property {PackageStatus[]} packages - All package statuses
 * @property {Set<string>} external_deps - Set of external dependency names
 * @property {Map<string, string>} project_versions - Map of package names to versions
 * @property {DependencyEdge[]} edges - All dependency edges
 */

// Check sync status with published versions if not skipped
const package_statuses = new Map();
if (!skip_publish_compare) {
    console.log('\nChecking sync status with published versions... (skip with --skip-publish-compare)');
    projects.forEach(project => {
        const is_sync = is_package_in_sync(project.path, project.name, project.version, verbose);
        package_statuses.set(project.name, {
            ...project,
            is_in_sync: is_sync
        });
    });
    
    const in_sync_count = Array.from(package_statuses.values()).filter(p => p.is_in_sync).length;
    const out_of_sync_count = package_statuses.size - in_sync_count;
    console.log(`Sync check complete: ${in_sync_count} in sync, ${out_of_sync_count} out of sync`);
} else {
    console.log('\nSkipping publish sync check (--skip-publish-compare flag used)');
    projects.forEach(project => {
        package_statuses.set(project.name, {
            ...project,
            is_in_sync: null // null means not checked
        });
    });
}

// Build dependency edges with computed statuses
/** @type {DependencyEdge[]} */
const dependency_edges = [];

projects.forEach(project => {
    Object.entries(project.dependencies).forEach(([dep_name, version]) => {
        const is_sibling = sibling_projects.has(dep_name);
        const is_dev_dep = project.dev_deps.includes(dep_name);
        
        // Check for version mismatch in sibling dependencies
        let has_version_mismatch = false;
        if (is_sibling) {
            const actual_version = project_versions.get(dep_name);
            const clean_required_version = version.replace(/[\^~>=<]/g, ''); // Remove version range operators
            has_version_mismatch = actual_version !== clean_required_version;
        }
        
        // Determine edge color
        let color;
        if (!is_sibling) {
            color = 'lightgrey'; // External dependencies are grey
        } else if (has_version_mismatch) {
            color = 'yellow'; // Version mismatch = yellow (behind)
        } else {
            // Check if target package is out of sync
            const target_status = package_statuses.get(dep_name);
            if (!skip_publish_compare && target_status && !target_status.is_in_sync) {
                color = 'red'; // Target is out of sync = red (can't publish)
            } else {
                color = 'blue'; // All good = blue
            }
        }
        
        dependency_edges.push({
            from: project.name,
            to: dep_name,
            version: version,
            is_sibling: is_sibling,
            is_dev_dep: is_dev_dep,
            has_version_mismatch: has_version_mismatch,
            color: color
        });
    });
});

/** @type {GraphData} */
const graph_data = {
    packages: Array.from(package_statuses.values()),
    external_deps: external_deps,
    project_versions: project_versions,
    edges: dependency_edges
};

// =============================================================================
// PHASE 2: RENDER THE GRAPH
// =============================================================================

// Generate GraphViz dot file
let dot_content = `digraph dependencies {
    rankdir=TB;
    node [shape=box, style=filled];
    
    // Graph title
    labelloc="t";
    label="Dependency Graph\\nGenerated: ${new Date().toISOString()}\\nDirectory: ${base_dir}";
    
    // Define node styles${show_legend ? `
    subgraph cluster_legend {
        label="Legend";
        style=filled;
        color=lightgrey;
        
        ${skip_publish_compare ? 
            'sibling_example [label="Sibling Repo\\n(sync check skipped)", fillcolor=lightgrey, shape=box];' :
            'sibling_in_sync [label="Sibling Repo\\n(in sync)", fillcolor=lightblue, shape=box];'
        }
        ${!skip_publish_compare ? 'sibling_out_of_sync [label="Sibling Repo\\n(out of sync)", fillcolor=lightcoral, shape=box];' : ''}
        external_example [label="External Package", fillcolor=yellow, shape=ellipse];
        edge_ok [label="OK", style=invis];
        edge_behind [label="Behind", style=invis];
        edge_blocked [label="Blocked", style=invis];
        
        ${skip_publish_compare ? 
            'sibling_example -> external_example [style=invis];' :
            'sibling_in_sync -> external_example [style=invis];'
        }
        ${!skip_publish_compare ? 'sibling_out_of_sync -> external_example [style=invis];' : ''}
        ${skip_publish_compare ? 
            'sibling_example -> edge_ok [color=blue, penwidth=2, label="Up to date"];' :
            'sibling_in_sync -> edge_ok [color=blue, penwidth=2, label="Up to date"];'
        }
        ${skip_publish_compare ? 
            'sibling_example -> edge_behind [color=yellow, penwidth=2, label="Version behind"];' :
            'sibling_in_sync -> edge_behind [color=yellow, penwidth=2, label="Version behind"];'
        }
        ${!skip_publish_compare ? (skip_publish_compare ? 
            'sibling_example -> edge_blocked [color=red, penwidth=2, label="Target not published"];' :
            'sibling_in_sync -> edge_blocked [color=red, penwidth=2, label="Target not published"];'
        ) : ''}
    }` : ''}
    
    // Project nodes (sibling repositories)
`;

// Add project nodes
graph_data.packages.forEach(package_status => {
    const node_id = safe_node_id(package_status.name);
    const label = `${escape_dot_string(package_status.name)}\\nv${package_status.version}`;
    
    // Determine node color based on sync status
    let node_color;
    if (skip_publish_compare) {
        node_color = 'lightgrey'; // Grey when sync check is skipped
    } else {
        node_color = package_status.is_in_sync ? 'lightblue' : 'lightcoral'; // Blue if in sync, red if out of sync
    }
    
    dot_content += `    ${node_id} [label="${label}", fillcolor=${node_color}];\n`;
});

dot_content += '\n    // External dependency nodes\n';

// Add external dependency nodes
graph_data.external_deps.forEach(dep => {
    const node_id = safe_node_id(dep);
    const label = escape_dot_string(dep);
    dot_content += `    ${node_id} [label="${label}", fillcolor=yellow, shape=ellipse];\n`;
});

dot_content += '\n    // Dependencies\n';

// Add dependency edges using pre-computed graph data
graph_data.edges.forEach(edge => {
    const from_id = safe_node_id(edge.from);
    const to_id = safe_node_id(edge.to);
    
    // Build edge style based on computed properties
    let edge_style;
    if (edge.is_sibling) {
        // Use the computed color
        edge_style = `color=${edge.color}, penwidth=2`;
    } else {
        edge_style = 'color=lightgrey, style=dashed';
    }
    
    if (edge.is_dev_dep) {
        edge_style += edge.is_sibling ? ', style="dashed,bold"' : ', style="dotted"';
    }
    
    const label = edge.version.replace(/[\^~]/g, ''); // Clean version for display
    
    dot_content += `    ${from_id} -> ${to_id} [label="${escape_dot_string(label)}", ${edge_style}];\n`;
});

dot_content += '}\n';

// Write the output file (DOT or SVG)
const output_path = path.resolve(output_file);

if (output_svg) {
    // Generate SVG directly using GraphViz
    try {
        const { execSync } = require('child_process');
        
        // Check if dot command is available
        try {
            execSync('which dot', { stdio: 'pipe' });
        } catch {
            console.error('❌ Error: GraphViz (dot command) not found. Please install GraphViz first.');
            console.error('On Ubuntu/Debian: sudo apt-get install graphviz');
            console.error('On CentOS/RHEL: sudo yum install graphviz');
            console.error('On macOS: brew install graphviz');
            process.exit(1);
        }
        
        // Create a temporary DOT file for processing
        const temp_dot_file = `/tmp/temp-${Date.now()}.dot`;
        fs.writeFileSync(temp_dot_file, dot_content);
        
        // Generate SVG from DOT
        execSync(`dot -Tsvg ${temp_dot_file} -o ${output_path}`, { stdio: 'pipe' });
        
        // Clean up temporary DOT file
        fs.unlinkSync(temp_dot_file);
        
        console.log(`\nDependency graph generated as SVG: ${output_path}`);
    } catch (err) {
        console.error(`❌ Error generating SVG:`, err.message);
        console.error('Falling back to DOT format...');
        fs.writeFileSync(output_path, dot_content);
        console.log(`\nDependency graph generated as DOT: ${output_path}`);
        console.log(`\nTo generate SVG manually, run:`);
        console.log(`  dot -Tsvg ${path.basename(output_file)} -o ${path.basename(output_file, '.svg')}.svg`);
    }
} else {
    // Write DOT file as usual
    fs.writeFileSync(output_path, dot_content);
    
    const is_temp_file = output_file.startsWith('/tmp/temp-deps-');
    if (is_temp_file) {
        console.log(`\nTemporary dependency graph created for viewing`);
    } else {
        console.log(`\nDependency graph generated: ${output_path}`);
        console.log(`\nTo generate an image, run one of:`);
        console.log(`  dot -Tpng ${path.basename(output_file)} -o dependencies.png`);
        console.log(`  dot -Tsvg ${path.basename(output_file)} -o dependencies.svg`);
        console.log(`  dot -Tpdf ${path.basename(output_file)} -o dependencies.pdf`);
    }
}

console.log(`\nSummary:`);
console.log(`  - ${graph_data.packages.length} sibling repositories`);
console.log(`  - ${graph_data.external_deps.size} external dependencies`);

// Show dependency statistics
const total_deps = graph_data.edges.length;
const sibling_deps = graph_data.edges.filter(edge => edge.is_sibling).length;

console.log(`  - ${total_deps} total dependency relationships`);
console.log(`  - ${sibling_deps} sibling dependencies`);
console.log(`  - ${total_deps - sibling_deps} external dependencies`);

// Show sync status summary
if (!skip_publish_compare) {
    const in_sync_count = graph_data.packages.filter(p => p.is_in_sync).length;
    const out_of_sync_count = graph_data.packages.length - in_sync_count;
    console.log(`  - ${in_sync_count} packages in sync with published versions`);
    console.log(`  - ${out_of_sync_count} packages out of sync with published versions`);
} else {
    console.log(`  - Publish sync check skipped`);
}

// Auto-generate and open SVG
if (output_svg && !show_path && !show_command) {
    console.log(`\nOpening dependency graph...`);
    
    try {
        const { execSync } = require('child_process');
        
        // Try to open the file
        let open_command;
        const platform = process.platform;
        
        if (platform === 'darwin') {
            open_command = 'open';
        } else if (platform === 'win32') {
            open_command = 'start';
        } else {
            // Linux and other Unix-like systems
            open_command = 'xdg-open';
        }
        
        try {
            // For Linux, use xdg-open with clean environment to avoid snap conflicts
            if (platform === 'linux') {
                try {
                    const { spawn } = require('child_process');
                    // Clean environment to avoid snap library conflicts
                    const cleanEnv = Object.assign({}, process.env);
                    delete cleanEnv.LD_LIBRARY_PATH;
                    
                    const proc = spawn('xdg-open', [output_path], {
                        detached: true,
                        stdio: 'ignore',
                        env: cleanEnv
                    });
                    proc.unref();
                    
                    console.log(`✓ Opened in default viewer`);
                } catch (xdgError) {
                    console.log(`❌ Could not open automatically: ${xdgError.message}`);
                    console.log(`📁 SVG file created at: ${output_path}`);
                    console.log(`You can open it manually.`);
                }
            } else {
                // For macOS and Windows, use the original approach
                execSync(`${open_command} "${output_path}"`, { stdio: 'ignore' });
                console.log(`✓ Opened in default viewer`);
            }
        } catch (openError) {
            console.error(`❌ Failed to open:`, openError.message);
            console.log(`📁 SVG file created at: ${output_path}`);
            console.log(`You can open it manually with your preferred viewer.`);
        }
        
    } catch (err) {
        console.error(`❌ Error opening SVG:`, err.message);
    }
} else if (output_svg && (show_path || show_command)) {
    if (show_path) {
        console.log(`\n📁 SVG file created at: ${output_path}`);
        console.log(`You can open it with your preferred viewer.`);
    }
    
    if (show_command) {
        console.log(`\n📁 SVG file created at: ${output_path}`);
        console.log(`\nTo open it, run one of these commands:`);
        console.log(`  firefox "${output_path}"`);
        console.log(`  google-chrome "${output_path}"`);
        console.log(`  eog "${output_path}"`);
        console.log(`  xdg-open "${output_path}"`);
    }
}